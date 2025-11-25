(function () {
    const STORAGE_KEY = 'theme';
    const toggleButton = document.querySelector('[data-theme-toggle]');
    if (!toggleButton) {
        return;
    }

    const icon = toggleButton.querySelector('i');

    const getInitialTheme = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
    };

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-mode', isLight);
        if (icon) {
            icon.classList.toggle('fa-sun', isLight);
            icon.classList.toggle('fa-moon', !isLight);
        }
        toggleButton.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        localStorage.setItem(STORAGE_KEY, theme);
    };

    let activeTheme = getInitialTheme();
    applyTheme(activeTheme);

    toggleButton.addEventListener('click', () => {
        activeTheme = activeTheme === 'light' ? 'dark' : 'light';
        applyTheme(activeTheme);
    });
})();
