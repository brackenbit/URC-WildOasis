/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve responsiveness for narrow screens
*/

import styled, { css } from "styled-components";

const Form = styled.form`
    ${(props) =>
        props.type !== "modal" &&
        css`
            // Only include padding and border if not in a modal
            padding: 2.4rem 4rem;

            /* Box */
            background-color: var(--color-grey-0);
            border: 1px solid var(--color-grey-100);
            border-radius: var(--border-radius-md);
        `}

    ${(props) =>
        props.type === "modal" &&
        css`
            @media (min-width: 1000px) {
                width: 80rem;
            }

            @media (max-width: 999px) {
                width: 80vw;
            }
        `}
    
  overflow: hidden;
    font-size: 1.4rem;
`;

Form.defaultProps = {
    type: "regular",
};

export default Form;
