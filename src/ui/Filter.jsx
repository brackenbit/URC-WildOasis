/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
    border: 1px solid var(--color-grey-100);
    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-sm);
    border-radius: var(--border-radius-sm);
    padding: 0.4rem;
    display: flex;
    gap: 0.4rem;
`;

const FilterButton = styled.button`
    background-color: var(--color-grey-0);
    border: none;

    ${(props) =>
        props.$active &&
        css`
            background-color: var(--color-brand-600);
            color: var(--color-brand-50);
        `}

    border-radius: var(--border-radius-sm);
    font-weight: 500;
    font-size: 1.4rem;
    /* To give the same height as select */
    padding: 0.44rem 0.8rem;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
    }
`;

export default function Filter({ filterField, options }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentFilter = searchParams.get(filterField) || options.at(0).value;

    function handleClick(value) {
        // Store chosen filter in URL search params
        searchParams.set(filterField, value);
        // Also reset page - new filter means new results, and pagination should be reset
        // (Not great separation of concerns - "page" is directly set by multiple components.
        //  However, this is safe. Setting "page" is always triggered by direct user action,
        //  so only a single call can occur at any given time.)
        if (searchParams.get("page")) {
            searchParams.set("page", 1);
        }
        setSearchParams(searchParams);
    }

    return (
        <StyledFilter>
            {options.map((option) => (
                <FilterButton
                    key={option.value}
                    onClick={() => handleClick(option.value)}
                    // Prefix with $ to make it a transient prop
                    // This allows it to be consumed by styled components rather than rendered to the DOM element.
                    // (Boolean true is not a valid value for HTML active parameter, would need to be "true".)
                    $active={option.value === currentFilter}
                    disabled={option.value === currentFilter}
                >
                    {option.label}
                </FilterButton>
            ))}
        </StyledFilter>
    );
}
