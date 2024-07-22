/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - support smart pagination (useResultsPerPage hook)
*/

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { useResultsPerPage } from "../../context/ResultsPerPageContext";

export function useBookings() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const { resultsPerPage } = useResultsPerPage();

    // FILTER
    const filterValue = searchParams.get("status");
    const filter =
        !filterValue || filterValue === "all"
            ? null
            : { field: "status", value: filterValue, method: "eq" };

    // SORT
    const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
    const [field, direction] = sortByRaw.split("-");
    const sortBy = { field, direction };

    // PAGINATION
    const page = !searchParams.get("page")
        ? 1
        : Number(searchParams.get("page"));

    // QUERY
    const {
        isLoading,
        data: { data: bookings, count } = {},
        error,
    } = useQuery({
        // Adding filter to queryKey means whenever filter changes, the query changes.
        // Old filter queries remain in the cache, but anything using useBookings automatically updates.
        // Essentially like useEffect dependency array.
        queryKey: ["bookings", filter, sortBy, page, "RPP"],
        // "RPP" key indicates results that should be invalidated when
        // resultsPerPage changes, e.g. on window resize
        queryFn: () => getBookings({ filter, sortBy, page, resultsPerPage }),
    });

    // PRE-FETCHING
    const pageCount = Math.ceil(count / resultsPerPage);

    if (page < pageCount) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page + 1, "RPP"],
            queryFn: () =>
                getBookings({ filter, sortBy, page: page + 1, resultsPerPage }),
        });
    }

    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page - 1, "RPP"],
            queryFn: () =>
                getBookings({ filter, sortBy, page: page - 1, resultsPerPage }),
        });
    }

    return { isLoading, bookings, error, count };
}
