/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use transient props (to avoid invalid parameters leaking onto the DOM).
    - appropriately handle sorting by name
    - support smart pagination
      - pass table body and row heights to useResultsPerPage
      - rerender on window resize
*/

import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { useResultsPerPage } from "../../context/ResultsPerPageContext";
import { useWindowResize } from "../../hooks/useWindowResize";
import { useRef } from "react";
import Pagination from "../../ui/Pagination";

export default function CabinTable() {
    const { isLoading, cabins, error, count: numCabins } = useCabins();
    const [searchParams] = useSearchParams();
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

    // FILTER
    // Filtering at the backend through the API would have been better here,
    // this is just an example of how to do it client-side.
    const filterValue = searchParams.get("discount") || "all";

    let filteredCabins;
    if (filterValue === "all") {
        filteredCabins = cabins;
    } else if (filterValue === "no-discount") {
        filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
    } else if (filterValue === "with-discount") {
        filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
    }

    // SORT
    const sortBy = searchParams.get("sortBy") || "name-asc";
    const [field, direction] = sortBy.split("-");

    let sortedCabins;
    if (field === "name") {
        // Name requires a little more handling to sort sensibly
        // Use localeCompare to properly sort strings.
        sortedCabins = filteredCabins.sort((a, b) =>
            direction === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
    } else {
        sortedCabins = filteredCabins.sort((a, b) =>
            direction === "asc" ? a[field] - b[field] : b[field] - a[field]
        );
    }

    return (
        <Menus>
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>
                <Table.Body
                    ref={bodyRef}
                    data={sortedCabins}
                    render={(cabin, index) => (
                        <CabinRow
                            cabin={cabin}
                            key={cabin.id}
                            ref={index === 0 ? rowRefCallback : null}
                        />
                    )}
                />
                <Table.Footer>
                    <Pagination resultsCount={numCabins} />
                </Table.Footer>
            </Table>
        </Menus>
    );
}
