"use client";

import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa"; 
import { TbSun } from "react-icons/tb";

export default function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("darkMode");
        if (savedTheme === "true") setDarkMode(true);
    }, []);

    // Save theme to localStorage
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const themeClass = darkMode
        ? "bg-black/90 text-white min-h-screen transition-colors duration-300"
        : "bg-white text-black min-h-screen transition-colors duration-300";

    return (
        <div className={themeClass}>
            {children}

            {/* Theme toggle button */}
            <button
                onClick={toggleTheme}
                className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow transition flex items-center gap-2 cursor-pointer 
                    ${darkMode 
                        ? "bg-white text-black" 
                        : "bg-black text-white"
                    }`
                }
            >
                {darkMode ? <TbSun size={20} /> : <FaMoon size={20}  />}
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
        </div>
    );
}
