/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - prevent automatically logging in as a newly created user (Supabase default)
    - upsert single avatar image
      (Example project retained redundant images over time.)
*/

import supabase, { supabaseUrl } from "./supabase";

export async function signUp({ fullName, email, password }) {
    // Workaround to prevent being automatically logged in as newly created user
    // Save existing session:
    const { data: savedSessionData } = await supabase.auth.getSession();

    // Sign up new user:
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: "",
            },
        },
    });

    // Restore previous session:
    if (savedSessionData) {
        await supabase.auth.setSession(savedSessionData.session);
    }

    if (error) {
        console.log(error.message);
        throw new Error("There was an error signing up the new user");
    }

    return data;
}

export async function login({ email, password }) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getCurrentUser() {
    // Try and fetch session from local storage
    const { data: session } = await supabase.auth.getSession();

    // If no session, there is no current user
    if (!session?.session) return null;

    // Do NOT rely on unencoded session data from local storage.
    // Even if local session exists, get trustworthy user data from remote supabase
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message);
    }

    return data?.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
}

export async function updateCurrentUser({ password, fullName, avatar }) {
    // Updates either password or fullName depending on what was passed
    // (As this is called by useUpdateUser from two different forms with different parameters.)

    let updateData;
    if (password) {
        updateData = { password };
    }
    if (fullName) {
        updateData = { data: { fullName } };
    }

    let data;
    let error;
    const initialUpdateResponse = await supabase.auth.updateUser(updateData);
    ({ data, error } = initialUpdateResponse);

    if (error) {
        throw new Error(error.message);
    }

    if (!avatar) return data;

    // Upload new avatar if this was provided
    const fileName = `avatar-${data.user.id}`;

    const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);

    if (storageError) {
        throw new Error(storageError.message);
    }

    // Update avatar in the user itself
    const avatarUpdateResponse = await supabase.auth.updateUser({
        data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
        },
    });
    ({ data, error } = avatarUpdateResponse);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
