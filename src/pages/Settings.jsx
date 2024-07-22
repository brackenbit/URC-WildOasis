/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to call SettingsFormWrapper
*/

import SettingsFormWrapper from "../features/settings/SettingsFormWrapper";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Settings() {
    return (
        <Row>
            <Heading as="h1">Update hotel settings</Heading>

            <SettingsFormWrapper />
        </Row>
    );
}

export default Settings;
