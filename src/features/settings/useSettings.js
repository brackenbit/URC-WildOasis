/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export function useSettings() {
    const {
        isLoading,
        error,
        data: settings,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    return { isLoading, error, settings };
}
