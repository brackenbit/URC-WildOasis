/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - remove redundant nav
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckOut() {
    const queryClient = useQueryClient();

    const { mutate: checkOut, isLoading: isCheckingOut } = useMutation({
        mutationFn: (bookingId) =>
            updateBooking(bookingId, {
                status: "checked-out",
            }),
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked out`);
            // Another way of invalidating queries:
            // Will simply invalidate any queries active on the page.
            queryClient.invalidateQueries({ active: true });
        },
        onError: () => toast.error("There was an error while checking out"),
    });

    return { checkOut, isCheckingOut };
}
