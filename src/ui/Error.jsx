/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Refactored into component for reuse.
*/

import styled from "styled-components";

const StyledError = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;

export default function Error({ children }) {
    return <StyledError>{children}</StyledError>;
}
