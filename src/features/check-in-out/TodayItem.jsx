/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve responsive design for small screen
      (Item splits content across two rows when narrow.
       The solution doesn't adhere to the best practices (it relies on magic numbers without a single source of truth)
       but this was a practical way to significantly improve the layout without spending too much time making big changes.)
    - support smarter nav after checkin
      (add origin to react router state, so checkins from dashboard can return to the dashboard)
*/

import styled from "styled-components";
import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import CheckoutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
    /* Default */
    display: grid;
    gap: 1.2rem;
    align-items: center;

    font-size: 1.4rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    /* Wide viewport */
    @media (min-width: 1410px) {
        grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
    }

    /* Narrow viewport (DashboardLayout still has default grid) */
    @media (min-width: 1164px) and (max-width: 1409px) {
        grid-template-columns: 9rem 2rem 1fr 9rem;
        grid-template-rows: auto auto;
    }

    /* Wide again (DashboardLayout has restacked) */
    @media (min-width: 860px) and (max-width: 1163px) {
        grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
    }

    /* Narrow again */
    @media (max-width: 859px) {
        grid-template-columns: 9rem 2rem 1fr 9rem;
        grid-template-rows: auto auto;
    }

    &:first-child {
        border-top: 1px solid var(--color-grey-100);
    }
`;

const Guest = styled.div`
    font-weight: 500;
    overflow: hidden;

    /* Narrow viewport (DashboardLayout still has default grid) */
    @media (min-width: 1164px) and (max-width: 1409px) {
        grid-column: 1 / -1;
        grid-row: 2 / 2;
    }

    /* Narrow again, with DashboardLayout restacked */
    @media (max-width: 859px) {
        grid-column: 1 / -1;
        grid-row: 2 / 2;
    }
`;

export default function TodayItem({ activity }) {
    const { id, status, guests, numNights } = activity;

    return (
        <StyledTodayItem>
            {status === "unconfirmed" && <Tag type="green">Arriving</Tag>}
            {status === "checked-in" && <Tag type="blue">Departing</Tag>}
            <Flag src={guests.countryFlag} alt={`Flag of {guests.country}`} />
            <Guest>{guests.fullName}</Guest>
            <div>{numNights} nights</div>

            {status === "unconfirmed" && (
                <Button
                    size="small"
                    variation="primary"
                    as={Link}
                    to={`/checkin/${id}`}
                    // Add origin to react router state
                    // (Only links from dashboard will have this, allowing smart nav after success)
                    state={{ origin: "dashboard" }}
                >
                    Check in
                </Button>
            )}
            {status === "checked-in" && <CheckoutButton bookingId={id} />}
        </StyledTodayItem>
    );
}
