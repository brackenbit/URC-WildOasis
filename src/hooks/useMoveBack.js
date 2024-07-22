/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useNavigate } from "react-router-dom";

export function useMoveBack() {
    const navigate = useNavigate();
    return () => navigate(-1);
}
