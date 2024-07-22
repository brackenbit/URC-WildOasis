/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";

export function useRecentStays() {
    const [searchParams] = useSearchParams();

    const numDays = !searchParams.get("last")
        ? 7
        : Number(searchParams.get("last"));

    const queryDate = subDays(new Date(), numDays).toISOString();

    const {
        isLoading,
        data: allStays,
        error,
    } = useQuery({
        queryFn: () => getStaysAfterDate(queryDate),
        queryKey: ["stays", `last-${numDays}`],
    });

    const stays = allStays?.filter(
        (stay) => stay.status === "checked-in" || stay.status === "checked-out"
    );

    return { isLoading, stays, error };
}
