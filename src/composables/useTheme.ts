import { ref } from 'vue';

const getInitialTheme = (): boolean => {
  const savedTheme = localStorage.getItem('talentpulse_theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Global singleton reactive theme ref
const isDarkMode = ref<boolean>(getInitialTheme());

// Apply theme class to <html> element
const applyTheme = (dark: boolean) => {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
    localStorage.setItem('talentpulse_theme', 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('talentpulse_theme', 'light');
  }
};

// Apply on initial script evaluation
applyTheme(isDarkMode.value);

export function useTheme() {
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme(isDarkMode.value);
  };

  const initTheme = () => {
    applyTheme(isDarkMode.value);
  };

  return {
    isDarkMode,
    toggleTheme,
    initTheme,
  };
}
