import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';

const themes = ['light', 'dark', 'system'] as const;
type Theme = (typeof themes)[number];

export default function DarkModeToggle() {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    useEffect(() => {
        if (theme === 'system') {
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
            document.documentElement.classList.toggle('dark', prefersDark);
        } else {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Cycle through themes
    const toggleTheme = () => {
        const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
        setTheme(nextTheme);
    };
    return (
        <Button className='rounded-full' size={'icon'} onClick={toggleTheme}>
            {theme === 'light' ? (
                <Sun />
            ) : theme === 'dark' ? (
                <Moon />
            ) : (
                <Monitor />
            )}
        </Button>
    );
}
