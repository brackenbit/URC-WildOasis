/*
    Brackenbit 2024

    New context to provide ResultsPerPage.
    Example project used a hard-coded constant for results per page.
    This context receives pageHeight and itemHeight from e.g. BookingTable, and automatically sets
    results per page to whatever will fit within the given size.
*/

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

const ResultsPerPageContext = createContext();

function ResultsPerPageProvider({ children }) {
    const [resultsPerPage, setResultsPerPage] = useState(1);
    const [oldResultsPerPage, setOldResultsPerPage] = useState(null);
    const [pageHeight, setPageHeight] = useState(1);
    const [itemHeight, setItemHeight] = useState(1);
    const queryClient = useQueryClient();

    useEffect(() => {
        setOldResultsPerPage(resultsPerPage);
        const resultsToFitPage = Math.floor(pageHeight / itemHeight) || 1;
        setResultsPerPage(resultsToFitPage);

        if (resultsPerPage !== oldResultsPerPage) {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes("RPP"),
                // "RPP" key is added to any query that depends on resultsPerPage
            });
        }
    }, [
        resultsPerPage,
        oldResultsPerPage,
        itemHeight,
        pageHeight,
        queryClient,
    ]);

    return (
        <ResultsPerPageContext.Provider
            value={{ resultsPerPage, setPageHeight, setItemHeight }}
        >
            {children}
        </ResultsPerPageContext.Provider>
    );
}

function useResultsPerPage() {
    const context = useContext(ResultsPerPageContext);
    if (context === undefined) {
        throw new Error("ResultsPerPageContext was used outside of a provider");
    }

    return context;
}

export { ResultsPerPageProvider, useResultsPerPage };
