/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Wrapper component to put the entire app in a protected route and enforce authentication.

    Updated to:
    - use isFetching instead of isLoading
      (isLoading only returns true for _initial_ render, introducing bugs when auth state changes over time)
*/

import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useUser } from "./useUser";
import { useNavigate } from "react-router-dom";
import Error from "../../ui/Error";
import { useEffect } from "react";

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const { isFetching, error, isAuthenticated } = useUser();

    // If not authenticated, redirect to log in
    // (useEffect so it will trigger e.g. after logout)
    useEffect(() => {
        // Don't redirect if still fetching
        // (Everyone's unauthenticated briefly if you're still fetching their auth status!)
        if (!isAuthenticated && !isFetching) {
            navigate("/login");
        }
    }, [isAuthenticated, isFetching, navigate]);

    if (isFetching)
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );

    if (error) {
        console.log(error.message);
        return <Error>Error fetching current user</Error>;
    }

    if (isAuthenticated) return children;
}
