/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import { useLogout } from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";

export default function Logout() {
    const { logout, isLoading } = useLogout();

    return (
        <ButtonIcon disabled={isLoading} onClick={logout}>
            {!isLoading ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
        </ButtonIcon>
    );
}
