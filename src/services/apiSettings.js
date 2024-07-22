/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - have getSettings only return relevant settings parameters, allowing it to be used with react-hook-forms defaultValues.
*/

import supabase from "./supabase";

export async function getSettings() {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

    if (error) {
        console.error(error);
        throw new Error("Settings could not be loaded");
    }

    // getSettings returns id, created_at
    // These aren't actually used, and complicate react-hook-forms usage, so remove them from what is returned.
    const settings = {
        minBookingLength: data.minBookingLength,
        maxBookingLength: data.maxBookingLength,
        maxGuestsPerBooking: data.maxGuestsPerBooking,
        breakfastPrice: data.breakfastPrice,
    };

    return settings;
}

// We expect a newSettings object that looks like {setting: newValue, otherSetting: otherNewValue...}
export async function updateSettings(newSettings) {
    const { data, error } = await supabase
        .from("settings")
        .update(newSettings)
        // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
        .eq("id", 1)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Settings could not be updated");
    }
    return data;
}
