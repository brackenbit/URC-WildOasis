/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import {
    HiOutlineBanknotes,
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

export default function Stats({ bookings, stays, numDays, cabinCount }) {
    const numBookings = bookings.length;

    const totalSales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);

    const totalCheckIns = stays.length;

    const checkedInNights = stays.reduce((acc, cur) => acc + cur.numNights, 0);
    const availableNights = numDays * cabinCount;
    const occupancyRate = checkedInNights / availableNights;

    return (
        <>
            <Stat
                title="Bookings"
                color="blue"
                icon={<HiOutlineBriefcase />}
                value={numBookings}
            />
            <Stat
                title="Sales"
                color="green"
                icon={<HiOutlineBanknotes />}
                value={formatCurrency(totalSales)}
            />
            <Stat
                title="Check Ins"
                color="indigo"
                icon={<HiOutlineCalendarDays />}
                value={totalCheckIns}
            />
            <Stat
                title="Occupancy Rate"
                color="yellow"
                icon={<HiOutlineChartBar />}
                value={Math.round(occupancyRate * 100) + "%"}
            />
        </>
    );
}
