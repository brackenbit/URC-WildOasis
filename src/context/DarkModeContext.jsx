/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(
        // Use OS preferences as default for dark mode
        window.matchMedia("(prefers-color-scheme: dark)").matches,
        "isDarkMode"
    );

    function toggleDarkMode() {
        setIsDarkMode((isDark) => !isDark);
    }

    // use an effect and DOM manipulation to add dark-mode/light-mode
    // class names to root html node
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
            document.documentElement.classList.remove("light-mode");
        } else {
            document.documentElement.classList.add("light-mode");
            document.documentElement.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error("DarkModeContext was used outside of a provider");
    }

    return context;
}

export { DarkModeProvider, useDarkMode };
