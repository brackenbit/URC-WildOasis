/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - redirect sensibly after checkin
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckIn(origin) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: checkIn, isLoading: isCheckingIn } = useMutation({
        mutationFn: ({ bookingId, breakfast, origin }) =>
            updateBooking(bookingId, {
                status: "checked-in",
                isPaid: true,
                ...breakfast,
            }),
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked in`);
            // Another way of invalidating queries:
            // Will simply invalidate any queries active on the page.
            queryClient.invalidateQueries({ active: true });

            if (origin === "dashboard") {
                navigate("/dashboard");
            } else {
                navigate("/bookings");
            }
        },
        onError: () => toast.error("There was an error while checking in"),
    });

    return { checkIn, isCheckingIn };
}
