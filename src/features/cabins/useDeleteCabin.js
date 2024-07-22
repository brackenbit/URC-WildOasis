/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
    const queryClient = useQueryClient();

    const { mutate: deleteCabin, isLoading: isDeleting } = useMutation({
        mutationFn: deleteCabinApi,
        onSuccess: () => {
            toast.success("Cabin successfully deleted.");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes("cabins"),
            });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { isDeleting, deleteCabin };
}
