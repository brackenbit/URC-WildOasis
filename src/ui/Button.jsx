/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use transient props (to avoid invalid parameters leaking onto the DOM)
    - always render 'secondary' button if disabled
    - include actual functional component, so ...rest props can be passed when used as={Link}
      (Example project just returned a styled component directly.)
*/

import styled, { css } from "styled-components";

const sizes = {
    small: css`
        font-size: 1.2rem;
        padding: 0.4rem 0.8rem;
        text-transform: uppercase;
        font-weight: 600;
        text-align: center;
    `,
    medium: css`
        font-size: 1.4rem;
        padding: 1.2rem 1.6rem;
        font-weight: 500;
    `,
    large: css`
        font-size: 1.6rem;
        padding: 1.2rem 2.4rem;
        font-weight: 500;
    `,
};

const variations = {
    primary: css`
        color: var(--color-brand-50);
        background-color: var(--color-brand-600);

        &:hover {
            background-color: var(--color-brand-700);
        }
    `,
    secondary: css`
        color: var(--color-grey-600);
        background: var(--color-grey-0);
        border: 1px solid var(--color-grey-200);

        &:hover {
            background-color: var(--color-grey-50);
        }
    `,
    danger: css`
        color: var(--color-red-100);
        background-color: var(--color-red-700);

        &:hover {
            background-color: var(--color-red-800);
        }
    `,
};

const StyledButton = styled.button`
    border: none;
    // Use native CSS variables to inject design tokens defined in GlobalStyles
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-sm);

    ${(props) => sizes[props.size]}

    ${(props) =>
        props.disabled ? variations["secondary"] : variations[props.$variation]}
`;

function Button({
    $variation = "primary",
    size = "medium",
    children,
    ...rest
}) {
    return (
        <StyledButton $variation={$variation} size={size} {...rest}>
            {children}
        </StyledButton>
    );
}

export default Button;
