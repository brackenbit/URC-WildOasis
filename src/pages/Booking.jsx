/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    (This component is a bit redundant, but implemented like this to adhere to project guidelines that:
     - routes point to high-level pages in 'pages' folder,
     - pages in 'pages' folder contain no side-effects
    )
*/

import BookingDetail from "../features/bookings/BookingDetail";

export default function Booking() {
    return <BookingDetail />;
}
