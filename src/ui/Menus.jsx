/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - use transient props (to avoid invalid parameters leaking onto the DOM).
    - fix context menu so it scrolls with window appropriately
    - fix positioning of menus close to the bottom of the screen
*/

import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledMenu = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }
`;

const StyledList = styled.ul`
    position: absolute;
    z-index: 1000;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);

    height: auto;

    right: ${(props) => props.$position.x}px;

    ${(props) =>
        props.$flip
            ? `
            bottom: ${props.$position.y}px;
        `
            : `
            top: ${props.$position.y}px;
        `}
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    gap: 1.6rem;

    &:hover {
        background-color: var(--color-grey-50);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

const MenusContext = createContext();

export default function Menus({ children }) {
    const [openId, setOpenId] = useState("");
    const [position, setPosition] = useState(null);
    const [flip, setFlip] = useState(false);
    const open = setOpenId;
    const close = () => setOpenId("");

    return (
        <MenusContext.Provider
            value={{
                openId,
                open,
                close,
                position,
                setPosition,
                flip,
                setFlip,
            }}
        >
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id }) {
    const { openId, open, close, setPosition, setFlip } =
        useContext(MenusContext);

    function handleClick(e) {
        e.stopPropagation();

        // Set position based on the rect of the button which was clicked
        // If too close to the bottom of the view, flip menu to appear above button
        const buttonRect = e.target.closest("button").getBoundingClientRect();
        const distanceToBottom = window.innerHeight + scrollY - buttonRect.y;

        let y;
        if (distanceToBottom >= 200) {
            y = buttonRect.y + buttonRect.height + 8 + scrollY;
            setFlip(false);
        } else {
            y = window.innerHeight + scrollY - buttonRect.y + 8;
            setFlip(true);
        }

        setPosition({
            x: window.innerWidth - buttonRect.width - buttonRect.x + scrollX,
            y: y,
        });

        if (openId === "" || openId !== id) {
            open(id);
        } else {
            close();
        }
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ id, children }) {
    const { openId, position, close, flip } = useContext(MenusContext);
    const ref = useOutsideClick(close, false);

    if (openId !== id) return null;

    return createPortal(
        <StyledList $position={position} $flip={flip} ref={ref}>
            {children}
        </StyledList>,
        document.body
    );
}

function Button({ children, icon, onClick }) {
    const { close } = useContext(MenusContext);

    function handleClick() {
        onClick?.();
        close();
    }
    return (
        <li>
            <StyledButton onClick={handleClick}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
}

Menus.Menu = StyledMenu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
