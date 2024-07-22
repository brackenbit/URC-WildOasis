/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve responsive design for small screen
      (Heading and operations split across two rows when narrow)
*/

import AddCabin from "../features/cabins/AddCabin";
import CabinTable from "../features/cabins/CabinTable";
import CabinTableOperations from "../features/cabins/CabinTableOperations";
import { useWindowResize } from "../hooks/useWindowResize";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Cabins() {
    useWindowResize();

    return (
        <>
            {window.innerWidth > 1200 ? (
                <Row type="horizontal">
                    <Heading as="h1">All cabins</Heading>
                    <CabinTableOperations />
                </Row>
            ) : (
                // (Unfortunately can't just use <Row type="vertical"> without breaking things elsewhere.)
                <div style={{ flexDirection: "column", gap: "1.6rem" }}>
                    <Heading as="h1">All cabins</Heading>
                    <CabinTableOperations />
                </div>
            )}

            <Row>
                <CabinTable />
                <AddCabin />
            </Row>
        </>
    );
}

export default Cabins;
