import { useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './Button';
import { useThemeStore } from '@/store/useThemeStore';
import { Dropdown, DropdownItem } from './Dropdown';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle theme"
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {theme === 'light' && <Sun className="h-5 w-5" />}
          {theme === 'dark' && <Moon className="h-5 w-5" />}
          {theme === 'system' && <Monitor className="h-5 w-5" />}
        </Button>
      }
    >
      <DropdownItem
        icon={<Sun className="h-4 w-4" />}
        onClick={() => {
          setTheme('light');
          setIsOpen(false);
        }}
        className={
          theme === 'light'
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
            : ''
        }
      >
        Light
      </DropdownItem>
      <DropdownItem
        icon={<Moon className="h-4 w-4" />}
        onClick={() => {
          setTheme('dark');
          setIsOpen(false);
        }}
        className={
          theme === 'dark'
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
            : ''
        }
      >
        Dark
      </DropdownItem>
      <DropdownItem
        icon={<Monitor className="h-4 w-4" />}
        onClick={() => {
          setTheme('system');
          setIsOpen(false);
        }}
        className={
          theme === 'system'
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
            : ''
        }
      >
        System
      </DropdownItem>
    </Dropdown>
  );
}
