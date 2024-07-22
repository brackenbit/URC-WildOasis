/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - support smart pagination (useResultsPerPage hook)
    - add pre-fetching
*/

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import { useResultsPerPage } from "../../context/ResultsPerPageContext";
import { useSearchParams } from "react-router-dom";

export function useCabins() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const { resultsPerPage } = useResultsPerPage();

    // PAGINATION
    const page = !searchParams.get("page")
        ? 1
        : Number(searchParams.get("page"));

    const {
        isLoading,
        data: { data: cabins, count } = {},
        error,
    } = useQuery({
        queryKey: ["cabins", page, "RPP"], // Uniquely identify the data we're querying
        // "RPP" key indicates results that should be invalidated when
        // resultsPerPage changes, e.g. on window resize
        queryFn: () => getCabins({ page, resultsPerPage }), // Function responsible for actually querying / fetching from API. Must return Promise.
    });

    // PRE-FETCHING
    const pageCount = Math.ceil(count / resultsPerPage);

    if (page < pageCount) {
        queryClient.prefetchQuery({
            queryKey: ["cabins", page + 1, "RPP"],
            queryFn: () => getCabins({ page: page + 1, resultsPerPage }),
        });
    }

    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["cabins", page - 1, "RPP"],
            queryFn: () => getCabins({ page: page - 1, resultsPerPage }),
        });
    }

    return { isLoading, cabins, error, count };
}
