/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import SignupForm from "../features/authentication/SignupForm";
import Heading from "../ui/Heading";

function NewUsers() {
    return (
        <>
            <Heading as="h1">Create a new user</Heading>
            <SignupForm />
        </>
    );
}

export default NewUsers;
