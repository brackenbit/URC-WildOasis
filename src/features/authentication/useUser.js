/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use isFetching instead of isLoading (see ProtectedRoute)
*/

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
    const {
        isFetching,
        data: user,
        error,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });

    return {
        isFetching,
        error,
        user,
        isAuthenticated: user?.role === "authenticated",
    };
}
