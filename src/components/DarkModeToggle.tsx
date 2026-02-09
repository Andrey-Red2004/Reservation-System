import { useEffect, useState } from "react";
const DarkModeToggle = () => {
    //Estado para controlar si esta en modo oscuro o claro
    const [isDark, setIsDark] = useState(() => {
        //obtener la preferencia guardada
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        // Si isDark es true entonces se agrega al html
        if (isDark) {
            document.documentElement.classList.add('dark');
            // Si isDark es false entonces se elimina de html
        } else {
            document.documentElement.classList.remove('dark');
        }
        //Guardar la preferencia en localStorage
        localStorage.setItem('darkMode',
            JSON.stringify(isDark));
    }, [isDark]);
    //Para cambiar entre oscuro y claro
    const toggleDarkMode = () => {
        setIsDark(!isDark);
    };
    return (
        <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={isDark ? 'Cambiar a modo Claro' :
                'Cambiar a modo Oscuro'}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
};

export default DarkModeToggle;