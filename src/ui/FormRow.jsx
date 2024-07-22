/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve layout
      (make better use of space, conditionally display errors in new row)
*/

import styled, { css } from "styled-components";

const StyledFormRow = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 20rem 1fr 4rem;
    column-gap: 2.4rem;
    row-gap: 0.8rem;

    padding: 1.2rem 0;

    ${(props) =>
        props.error &&
        css`
            grid-template-rows: auto auto;
        `}

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
    grid-row: -1 / -1;
    grid-column: 1 / -1;
`;

const Label = styled.label`
    font-weight: 500;
`;

export default function FormRow({ label, error, children }) {
    return (
        <StyledFormRow error={error}>
            {label && <Label htmlFor={children.props.id}>{label}</Label>}
            {/* Pass input component as child to avoid prop drilling */}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}
