/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve responsive design for small screen
      (Example project was not usable with narrow screen.
      Updated to stack items vertically when narrow.)
*/

import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
    /* Defaults */
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto 34rem auto;
    gap: 2.4rem;

    /* Wide viewport */
    @media (min-width: 1164px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: auto 34rem auto;
    }

    /* Narrow viewport */
    @media (max-width: 1163px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto 34rem 34rem auto;
    }
`;

export default function DashboardLayout() {
    const {
        bookings,
        isLoading: isLoadingBookings,
        numDays,
    } = useRecentBookings();
    const { stays, isLoading: isLoadingStays } = useRecentStays();
    const { cabins, isLoading: isLoadingCabins } = useCabins();

    if (isLoadingBookings || isLoadingStays || isLoadingCabins)
        return <Spinner />;

    return (
        <StyledDashboardLayout>
            <Stats
                bookings={bookings}
                stays={stays}
                numDays={numDays}
                cabinCount={cabins.length}
            />
            <TodayActivity />
            <DurationChart stays={stays} />
            <SalesChart bookings={bookings} numDays={numDays} />
        </StyledDashboardLayout>
    );
}
