/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSettings as updateSettingsApi } from "../../services/apiSettings";

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    const { mutate: updateSettings, isLoading: isUpdating } = useMutation({
        mutationFn: updateSettingsApi,
        onSuccess: () => {
            toast.success("Setting successfully updated");
            queryClient.invalidateQueries({
                queryKey: ["settings"],
            });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { isUpdating, updateSettings };
}
