/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
    
    Example project component had some issues with readability, and used fragile, deprecated cloneElement function.
    Rewritten to improve clarity and use render props pattern and createElement function.
*/

import { createContext, createElement, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 3.2rem 4rem;
    transition: all 0.5s;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--backdrop-color);
    backdrop-filter: blur(4px);
    z-index: 1000;
    transition: all 0.5s;
`;

const Button = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;
    position: absolute;
    top: 1.2rem;
    right: 1.9rem;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-500);
    }
`;

const ModalContext = createContext();

export default function Modal({ children }) {
    // openName sets which, if any, modal is open
    const [openName, setOpenName] = useState("");
    const close = () => setOpenName("");
    const open = setOpenName;

    return (
        <ModalContext.Provider value={{ openName, close, open }}>
            {children}
        </ModalContext.Provider>
    );
}

function Open({ opens: windowToOpen, render }) {
    const { open } = useContext(ModalContext);

    // Use render props to inject the open function into the child (e.g. Button)
    return render(() => open(windowToOpen));
}

function Window({ children, name }) {
    const { openName, close } = useContext(ModalContext);
    const ref = useOutsideClick(close);

    if (name !== openName) return null;

    // Alternative way of injecting required function into children, using createElement.
    // Create a new component which is just the child, with an added prop.
    const injectedChildren = createElement(children.type, {
        ...children.props,
        onCloseModal: close,
    });

    // Use createPortal to place the modal at an arbitrary point on the DOM tree.
    // This can help with accessibility, and avoid CSS interference when reusing in different places.
    return createPortal(
        // JSX to render
        <Overlay>
            <StyledModal ref={ref}>
                <Button onClick={close}>
                    <HiXMark />
                </Button>
                <div>{injectedChildren}</div>
            </StyledModal>
        </Overlay>,
        // DOM node where we want to render
        document.body
    );
}

Modal.Open = Open;
Modal.Window = Window;
