/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
    
    useOutsideClick - used to detect clicks outside e.g. modal, and call a passed handler function
    listenCapturing (boolean) sets whether event listener should be attached to capture phase
    instead of bubbling phase.
    This is necessary because with e.g. modal attached at DOM body, an event listener on the bubbling phase
    will detect the click _used to open the modal_, and immediately close it.

*/

import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
    const ref = useRef();

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                handler();
            }
        }

        document.addEventListener("click", handleClick, listenCapturing);

        // Must remove event listener when component unmounts, return cleanup callback
        return () => document.removeEventListener("click", handleClick);
    }, [handler, listenCapturing]);

    return ref;
}
