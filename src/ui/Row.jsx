/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - make vertical Row take full parent height
*/

import styled, { css } from "styled-components";

const Row = styled.div`
    display: flex;

    ${(props) =>
        props.type === "horizontal" &&
        css`
            justify-content: space-between;
            align-items: center;
        `}

    ${(props) =>
        props.type === "vertical" &&
        css`
            flex-direction: column;
            gap: 1.6rem;
            height: 100%;
        `}
`;

// Can set default props like this:
// (Ordinarily set using destructuring syntax, which can't be used here.)
Row.defaultProps = {
    type: "vertical",
};

export default Row;
