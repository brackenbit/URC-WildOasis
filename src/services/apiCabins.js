/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - refactor into separate "createCabin" and "editCabin" functions
      (Example project used a single function for both.)
    - upsert single image for cabin
      (Example project retained redundant images over time.)
    - retain cabin if there's an error uploading image during edit
    - support smart pagination
      (take resultsPerPage as a parameter, return count)
*/

import supabase, { supabaseUrl } from "./supabase";

export async function getCabins({ page, resultsPerPage }) {
    let query = supabase.from("cabins").select("*", { count: "exact" });

    // PAGINATION
    if (page) {
        const firstResult = (page - 1) * resultsPerPage;
        const lastResult = firstResult + resultsPerPage - 1;

        query = query.range(firstResult, lastResult);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("Cabins could not be loaded: ", error.message);
        throw new Error("Cabins could not be loaded.");
    }

    return { data, count };
}

export async function createCabin(newCabin) {
    let data;
    let error;

    // Create cabin (with placeholder image path)
    const createResponse = await supabase
        .from("cabins")
        .insert([{ ...newCabin, image: "" }])
        .select()
        .single();
    ({ data, error } = createResponse);

    if (error) {
        console.error("Cabin could not be created: ", error.message);
        throw new Error("Cabin could not be created.");
    }

    // Prepare image name and path
    const imageName = `${data.id}-cabin_image`;
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // Upload image
    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // Delete the cabin if there was an error uploading the image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);
        console.log(storageError);
        throw new Error(
            "Cabin image could not be uploaded; the cabin was not created"
        );
    }

    // Otherwise update cabin with image path
    const updateResponse = await supabase
        .from("cabins")
        .update({ image: imagePath })
        .eq("id", data.id)
        .select()
        .single();
    ({ data, error } = updateResponse);

    if (error) {
        console.error("Error updating cabin image path: ", error.message);
        throw new Error("Error updating cabin image path.");
    }

    return data;
}

export async function editCabin(newCabin, id) {
    const hasNewImage = !newCabin.image?.startsWith?.(supabaseUrl);
    let imageName;
    let imagePath;

    if (hasNewImage) {
        imageName = `${id}-cabin_image`;
        imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
    } else {
        imagePath = newCabin.image;
    }

    // 1. Edit cabin
    const { data, error } = await supabase
        .from("cabins")
        .update({ ...newCabin, image: imagePath })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Cabin could not be edited: ", error.message);
        throw new Error("Cabin could not be edited.");
    }

    // 2. Upload image (if required)
    if (!hasNewImage) return data;

    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image, { upsert: true });

    // 3. Inform if there was an error uploading the image
    // (Cabin is NOT deleted if this fails during edit.)
    if (storageError) {
        console.log(storageError);
        throw new Error("Cabin image could not be uploaded.");
    }

    return data;
}

export async function deleteCabin(id) {
    const { error } = await supabase.from("cabins").delete().eq("id", id);

    if (error) {
        console.error("Cabin could not be deleted: ", error.message);
        throw new Error("Cabin could not be deleted.");
    }
}
