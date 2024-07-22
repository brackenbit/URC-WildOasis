/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use transient props (to avoid invalid parameters leaking onto the DOM).
    - remove redundant return of <Empty> component
    - support smart pagination
      - pass table body and row heights to useResultsPerPage
      - rerender on window resize
*/

import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import { useBookings } from "./useBookings";
import Pagination from "../../ui/Pagination";
import { useRef } from "react";
import { useResultsPerPage } from "../../context/ResultsPerPageContext";
import { useWindowResize } from "../../hooks/useWindowResize";

function BookingTable() {
    const { bookings, isLoading, error, count: numBookings } = useBookings();
    const { resultsPerPage, setPageHeight, setItemHeight } =
        useResultsPerPage();

    // Trigger rerender on window resize:
    useWindowResize();

    // Use a callback ref to get height of the <Table.Body>
    // (Using a normal ref and useEffect is not possible due to timing issues,
    // the DOM update is not actually complete when component is considered mounted.)
    const bodyRef = (node) => {
        if (node) {
            setPageHeight(node.getBoundingClientRect().height);
        }
    };

    const rowRef = useRef(null);

    const rowRefCallback = (node) => {
        if (node && !rowRef.current) {
            rowRef.current = node;
            setItemHeight(node.getBoundingClientRect().height);
        }
    };

    if (isLoading) return <Spinner />;

    if (error) {
        console.log(error);
    }

    return (
        <Menus>
            <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
                <Table.Header>
                    <div>Cabin</div>
                    <div>Guest</div>
                    <div>Dates</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div></div>
                </Table.Header>

                <Table.Body
                    ref={bodyRef}
                    data={bookings}
                    render={(booking, index) => (
                        <BookingRow
                            key={booking.id}
                            booking={booking}
                            ref={index === 0 ? rowRefCallback : null}
                        />
                    )}
                />

                <Table.Footer>
                    <Pagination resultsCount={numBookings} />
                </Table.Footer>
            </Table>
        </Menus>
    );
}

export default BookingTable;
