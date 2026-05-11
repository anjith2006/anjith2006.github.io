(function () {
    const STORAGE_KEY = 'theme';

    // --- Shared sidebar injected into every page ---
    const SIDEBAR_HTML = `
<aside class="sidebar">
    <div class="profile-card">
        <a href="index.html">
            <img src="Figures/anjith.png" alt="Anjith George" class="avatar">
        </a>
        <h1 class="profile-name">Anjith George</h1>
        <p class="profile-role">Researcher, Idiap</p>
        <ul class="site-nav">
            <li><a href="index.html" class="nav-link" data-page="home"><i class="fa-solid fa-house"></i> About</a></li>
            <li><a href="research.html" class="nav-link" data-page="research"><i class="fa-solid fa-microchip"></i> Research</a></li>
            <li><a href="publications.html" class="nav-link" data-page="publications"><i class="fa-solid fa-book-open"></i> Publications</a></li>
            <li><a href="resume.html" class="nav-link" data-page="cv"><i class="fa-solid fa-file-lines"></i> CV</a></li>
            <li><a href="resources.html" class="nav-link" data-page="resources"><i class="fa-solid fa-box-archive"></i> Resources</a></li>
            <li><a href="demos.html" class="nav-link" data-page="demos"><i class="fa-solid fa-video"></i> Demos</a></li>
        </ul>
        <div class="social-row">
            <a href="mailto:anjith2006@gmail.com" class="social-btn" title="Email"><i class="fa-solid fa-envelope"></i></a>
            <a href="http://github.com/anjith2006" target="_blank" class="social-btn" title="GitHub"><i class="fa-brands fa-github"></i></a>
            <a href="https://www.linkedin.com/in/anjithgeorge" target="_blank" class="social-btn" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="https://medium.com/@anjithgeorge" target="_blank" class="social-btn" title="Medium"><i class="fa-brands fa-medium"></i></a>
            <a href="https://www.youtube.com/channel/UCF-4bAPWrVmkLxQRTjDz0yQ" target="_blank" class="social-btn" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
    </div>
</aside>`;

    const placeholder = document.getElementById('sidebar-ph');
    if (placeholder) {
        placeholder.outerHTML = SIDEBAR_HTML;
    }

    // --- Theme toggle ---
    const toggleButton = document.querySelector('[data-theme-toggle]');
    if (!toggleButton) return;

    const icon = toggleButton.querySelector('i');

    const getInitialTheme = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
        // Default to light; honour dark-preference users
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark-mode', isDark);
        if (icon) {
            icon.classList.toggle('fa-sun', isDark);
            icon.classList.toggle('fa-moon', !isDark);
        }
        toggleButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        localStorage.setItem(STORAGE_KEY, theme);
    };

    let activeTheme = getInitialTheme();
    applyTheme(activeTheme);

    toggleButton.addEventListener('click', () => {
        activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(activeTheme);
    });
})();
