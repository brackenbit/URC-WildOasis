/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ToasterWithMax from "./ui/ToasterWithMax";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";
import ProtectedRoute from "./features/authentication/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import { ResultsPerPageProvider } from "./context/ResultsPerPageContext";

const queryClient = new QueryClient({
    // e.g. of setting options - staleTime to 60 seconds
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
});

export default function App() {
    return (
        <DarkModeProvider>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <GlobalStyles />
                <BrowserRouter>
                    <Routes>
                        <Route
                            element={
                                <ProtectedRoute>
                                    <ResultsPerPageProvider>
                                        <AppLayout />
                                    </ResultsPerPageProvider>
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Navigate replace to="/dashboard" />}
                            />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="bookings" element={<Bookings />} />
                            <Route
                                path="bookings/:bookingId"
                                element={<Booking />}
                            />
                            <Route
                                path="checkin/:bookingId"
                                element={<CheckIn />}
                            />
                            <Route path="cabins" element={<Cabins />} />
                            <Route path="users" element={<Users />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="account" element={<Account />} />
                        </Route>
                        <Route path="login" element={<Login />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>

                <ToasterWithMax
                    max={3}
                    position="top-center"
                    gutter={12}
                    containerStyle={{ margin: "8px" }}
                    toastOptions={{
                        success: { duration: 3000 },
                        error: { duration: 6000 },
                        style: {
                            fontSize: "16px",
                            maxWidth: "500px",
                            padding: "16px 24px",
                            backgroundColor: "var(--color-grey-0)",
                            color: "var(--color-grey-700)",
                        },
                    }}
                />
            </QueryClientProvider>
        </DarkModeProvider>
    );
}
