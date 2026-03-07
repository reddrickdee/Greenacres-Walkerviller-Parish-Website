import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof document !== 'undefined') {
            return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
        }
        return 'light';
    });

    // Sync to ensure state matches document if changed outside React
    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
        if (currentTheme && currentTheme !== theme) {
            setThemeState(currentTheme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('parish-theme', newTheme);
        // Sync browser chrome / PWA theme-color
        const themeColor = newTheme === 'dark' ? '#0A0B0E' : '#F4EFE6';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
