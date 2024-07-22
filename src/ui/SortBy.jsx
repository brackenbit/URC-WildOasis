/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - reset pagination on change in sort order
*/

import { useSearchParams } from "react-router-dom";
import Select from "./Select";

export default function SortBy({ options }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get("sortBy") || "";

    function handleChange(e) {
        searchParams.set("sortBy", e.target.value);
        setSearchParams(searchParams);

        // Also reset page - new sort order means pagination should be reset
        // (Not great separation of concerns - "page" is directly set by multiple components.
        //  However, this is safe. Setting "page" is always triggered by direct user action,
        //  so only a single call can occur at any given time.)
        if (searchParams.get("page")) {
            searchParams.set("page", 1);
        }
        setSearchParams(searchParams);
    }

    return (
        <Select
            options={options}
            type="white"
            value={sortBy}
            onChange={handleChange}
        />
    );
}
