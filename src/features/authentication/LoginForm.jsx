/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - automatically populate a default demo user, if provided in .env
*/

import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
    let defaultEmail = "";
    let defaultPassword = "";
    if (
        import.meta.env.VITE_DEFAULT_USER_EMAIL &&
        import.meta.env.VITE_DEFAULT_USER_PASSWORD
    ) {
        defaultEmail = import.meta.env.VITE_DEFAULT_USER_EMAIL;
        defaultPassword = import.meta.env.VITE_DEFAULT_USER_PASSWORD;
    }
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState(defaultPassword);

    const { login, isLoggingIn } = useLogin();

    function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) return;

        login(
            { email, password },
            {
                // login is a mutate function, so can chain some options
                // onSettled fires after either success or error
                // e.g. useful to clear the form after a typo in credentials
                onSettled: () => {
                    setEmail("");
                    setPassword("");
                },
            }
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormRowVertical label="Email address">
                <Input
                    type="email"
                    id="email"
                    // This makes this form better for password managers
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoggingIn}
                />
            </FormRowVertical>
            <FormRowVertical label="Password">
                <Input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                />
            </FormRowVertical>
            <FormRowVertical>
                <Button size="large" disabled={isLoggingIn}>
                    {!isLoggingIn ? "Log in" : <SpinnerMini />}
                </Button>
            </FormRowVertical>
        </Form>
    );
}

export default LoginForm;
