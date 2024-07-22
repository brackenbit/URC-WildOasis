/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use new editCabin function from API refactor
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editCabin as editCabinApi } from "../../services/apiCabins";

export function useEditCabin() {
    const queryClient = useQueryClient();

    const { mutate: editCabin, isLoading: isEditing } = useMutation({
        mutationFn: ({ newCabinData, id }) => editCabinApi(newCabinData, id),
        onSuccess: () => {
            toast.success("Cabin successfully edited");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes("cabins"),
            });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { isEditing, editCabin };
}
