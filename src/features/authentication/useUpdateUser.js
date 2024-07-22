/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser as updateCurrentUserApi } from "../../services/apiAuth";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    const { mutate: updateCurrentUser, isLoading: isUpdating } = useMutation({
        mutationFn: updateCurrentUserApi,
        onSuccess: ({ user }) => {
            toast.success("User successfully updated");
            queryClient.setQueryData(["user"], user);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { isUpdating, updateCurrentUser };
}
