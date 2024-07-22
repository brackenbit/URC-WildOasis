/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use transient props (to avoid invalid parameters leaking onto the DOM).
*/

import Button from "../../ui/Button";
import { useCheckOut } from "./useCheckOut";

function CheckoutButton({ bookingId }) {
    const { checkOut, isCheckingOut } = useCheckOut();
    return (
        <Button
            $variation="primary"
            size="small"
            onClick={() => checkOut(bookingId)}
            disabled={isCheckingOut}
        >
            Check out
        </Button>
    );
}

export default CheckoutButton;
