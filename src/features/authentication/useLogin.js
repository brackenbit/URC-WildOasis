/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - correctly add user to query cache
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: login, isLoading: isLoggingIn } = useMutation({
        mutationFn: ({ email, password }) => loginApi({ email, password }),
        onSuccess: (data) => {
            // Add newly logged-in user to TQ cache
            // (Can improve performance on subsequent calls to e.g. useUser)
            queryClient.setQueriesData(["user"], data.user);
            navigate("/dashboard", { replace: true });
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message);
        },
    });

    return { login, isLoggingIn };
}
