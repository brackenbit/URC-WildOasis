/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use transient props (to avoid invalid parameters leaking onto the DOM).
    - support smart pagination
      - use forwardRef to get refs of Body and Row
      - fill available space, with Body growing to fit
*/

import { createContext, forwardRef, useContext } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
    border: 1px solid var(--color-grey-200);

    font-size: 1.4rem;
    background-color: var(--color-grey-0);
    border-radius: 7px;
    overflow: hidden;

    height: 100%;
    display: flex;
    flex-direction: column;
`;

const CommonRow = styled.div`
    display: grid;

    grid-template-columns: ${(props) => props.$columns};
    column-gap: 2.4rem;
    align-items: center;
    transition: none;
`;

const StyledHeader = styled(CommonRow)`
    padding: 1.6rem 2.4rem;

    background-color: var(--color-grey-50);
    border-bottom: 1px solid var(--color-grey-100);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: var(--color-grey-600);

    flex: auto 0 auto;
`;

const StyledRow = styled(CommonRow)`
    padding: 1.2rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const StyledBody = styled.section`
    margin: 0.4rem 0;
    overflow: scroll;

    flex: 1 1 auto;
`;

const Footer = styled.footer`
    background-color: var(--color-grey-50);
    display: flex;
    justify-content: center;
    padding: 1.2rem;

    flex: auto 0 auto;

    /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
    &:not(:has(*)) {
        display: none;
    }
`;

const Empty = styled.p`
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
    margin: 2.4rem;

    flex: 1 1 auto;
`;

const TableContext = createContext();

export default function Table({ columns, children }) {
    return (
        <TableContext.Provider value={{ columns }}>
            <StyledTable role="table">{children}</StyledTable>
        </TableContext.Provider>
    );
}

function Header({ children }) {
    const { columns } = useContext(TableContext);
    return (
        <StyledHeader role="row" $columns={columns} as="header">
            {children}
        </StyledHeader>
    );
}

// use forwardRef to pass ref through functional component
const Body = forwardRef(function Body2({ data, render }, ref) {
    if (!data.length) return <Empty>No data to show</Empty>;

    return (
        <StyledBody ref={ref}>
            {data.map((item, index) => render(item, index))}
        </StyledBody>
    );
});

const Row = forwardRef(function Row({ children }, ref) {
    const { columns } = useContext(TableContext);
    return (
        <StyledRow role="row" $columns={columns} ref={ref}>
            {children}
        </StyledRow>
    );
});

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
