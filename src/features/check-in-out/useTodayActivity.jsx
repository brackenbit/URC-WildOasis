/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";

export function useTodayActivity() {
    const { isLoading, data: activities } = useQuery({
        queryFn: getStaysTodayActivity,
        queryKey: ["today-activity"],
    });

    return { activities, isLoading };
}
