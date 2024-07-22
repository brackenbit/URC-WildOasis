/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import styled, { css } from "styled-components";

// Styled component is defined using template literal,
// which means we can include arbitrary JS inside to conditionally set parameters.
// Use of "as" prop means these will be rendered as appropriate element, not necessarily h1
const Heading = styled.h1`
    ${(props) =>
        props.as === "h1" &&
        css`
            font-size: 3rem;
            font-weight: 600px;
        `}

    ${(props) =>
        props.as === "h2" &&
        css`
            font-size: 2rem;
            font-weight: 600px;
        `}

    ${(props) =>
        props.as === "h3" &&
        css`
            font-size: 2rem;
            font-weight: 500px;
        `}
    
    ${(props) =>
        props.as === "h4" &&
        css`
            font-size: 3rem;
            font-weight: 600px;
            text-align: center;
        `}
    
    line-height: 1.4;
`;

export default Heading;
