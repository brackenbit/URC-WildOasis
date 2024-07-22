/*
    Brackenbit 2024

    New hook to detect window resizes.
    Used e.g. to trigger rerender of table with smart pagination
*/

import { useEffect, useState } from "react";

export function useWindowResize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}
