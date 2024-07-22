/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin as createCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateCabin() {
    const queryClient = useQueryClient();

    const { mutate: createCabin, isLoading: isCreating } = useMutation({
        mutationFn: createCabinApi,
        onSuccess: () => {
            toast.success("New cabin successfully created");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes("cabins"),
            });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { isCreating, createCabin };
}
