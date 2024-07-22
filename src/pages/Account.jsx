/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve layout and add scrolling
*/

import styled from "styled-components";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import Heading from "../ui/Heading";

const StyledRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
`;

function Account() {
    return (
        <div style={{ overflow: "scroll" }}>
            <Heading as="h1">Update your account</Heading>

            {/* (Unfortunately can't just use <Row type="vertical"> without breaking things elsewhere.) */}
            <StyledRow>
                <Heading as="h3">Update user data</Heading>
                <UpdateUserDataForm />
            </StyledRow>

            <StyledRow>
                <Heading as="h3">Update password</Heading>
                <UpdatePasswordForm />
            </StyledRow>
        </div>
    );
}

export default Account;
