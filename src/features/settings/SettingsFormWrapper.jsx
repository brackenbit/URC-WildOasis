/*
    Brackenbit 2024

    SettingsFormWrapper - Provides settings to SettingsForm, handles loading/error state.

    Using react-hook-forms with defaultValues provided from an async source can be tricky.
    Simplest solution is to have a parent wrapper component which passes the async data to
    a child which implements the actual form.
*/

import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import SettingsForm from "./SettingsForm";
import Error from "../../ui/Error";

export default function SettingsFormWrapper() {
    const { isLoading, error, settings } = useSettings();

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        <Error>{error}</Error>;
    }

    return <SettingsForm settings={settings} />;
}
