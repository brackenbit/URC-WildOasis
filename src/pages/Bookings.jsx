/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve responsive design for small screen
      (Heading and operations split across two rows when narrow)
*/

import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import { useWindowResize } from "../hooks/useWindowResize";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Bookings() {
    useWindowResize();

    return (
        <>
            {window.innerWidth > 1200 ? (
                <Row type="horizontal">
                    <Heading as="h1">All bookings</Heading>
                    <BookingTableOperations />
                </Row>
            ) : (
                // (Unfortunately can't just use <Row type="vertical"> without breaking things elsewhere.)
                <div style={{ flexDirection: "column", gap: "1.6rem" }}>
                    <Heading as="h1">All bookings</Heading>
                    <BookingTableOperations />
                </div>
            )}
            <BookingTable />
        </>
    );
}

export default Bookings;
