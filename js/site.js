(function () {
    const STORAGE_KEY = 'theme';

    // ── Sidebar (single source of truth) ──────────────────────────
    const SIDEBAR_HTML = `
<aside class="sidebar">
    <div class="profile-card">
        <a href="index.html">
            <img src="Figures/anjith.png" alt="Anjith George" class="avatar">
        </a>
        <h1 class="profile-name">Anjith George</h1>
        <p class="profile-role">Machine Learning Researcher</p>
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
    if (placeholder) placeholder.outerHTML = SIDEBAR_HTML;

    // ── Theme ──────────────────────────────────────────────────────
    const toggleBtn = document.querySelector('[data-theme-toggle]');
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');

    const getInitialTheme = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme, animate) => {
        const isDark = theme === 'dark';
        if (animate) {
            document.documentElement.classList.add('theme-fx');
            setTimeout(() => document.documentElement.classList.remove('theme-fx'), 380);
        }
        document.body.classList.toggle('dark-mode', isDark);
        if (icon) {
            icon.classList.toggle('fa-sun',  isDark);
            icon.classList.toggle('fa-moon', !isDark);
        }
        toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        localStorage.setItem(STORAGE_KEY, theme);
    };

    let activeTheme = getInitialTheme();
    applyTheme(activeTheme, false);

    toggleBtn.addEventListener('click', () => {
        activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(activeTheme, true);
    });

    // ── Back-to-top ────────────────────────────────────────────────
    const backTop = Object.assign(document.createElement('button'), {
        className: 'back-top',
        innerHTML: '<i class="fa-solid fa-arrow-up"></i>',
    });
    backTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backTop);

    window.addEventListener('scroll', () => {
        backTop.classList.toggle('back-top--on', window.scrollY > 500);
    }, { passive: true });

    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Publications: search + year navigator ─────────────────────
    if (document.body.dataset.page === 'publications') {
        const contentArea = document.querySelector('.content-area');
        const pageHeader  = document.querySelector('.page-header');

        // ·· Search bar
        if (pageHeader && contentArea) {
            const wrap = document.createElement('div');
            wrap.className = 'pub-search-wrap';
            wrap.innerHTML =
                '<i class="fa-solid fa-magnifying-glass pub-search-icon"></i>' +
                '<input class="pub-search" type="search" placeholder="Search by title, author, or venue…" autocomplete="off" spellcheck="false">' +
                '<span class="pub-count"></span>';
            pageHeader.after(wrap);

            const input    = wrap.querySelector('.pub-search');
            const countEl  = wrap.querySelector('.pub-count');
            const papers   = [...document.querySelectorAll('details')];
            const yearHds  = [...document.querySelectorAll('.year-heading')];

            input.addEventListener('input', () => {
                const q = input.value.toLowerCase().trim();
                let n = 0;
                papers.forEach(d => {
                    const show = !q || d.textContent.toLowerCase().includes(q);
                    d.style.display = show ? '' : 'none';
                    if (show) n++;
                });
                yearHds.forEach(h => {
                    let sib = h.nextElementSibling, any = false;
                    while (sib && sib.tagName === 'DETAILS') {
                        if (sib.style.display !== 'none') any = true;
                        sib = sib.nextElementSibling;
                    }
                    h.style.display = any ? '' : 'none';
                });
                countEl.textContent = q ? `${n} paper${n !== 1 ? 's' : ''}` : '';
            });
        }

        // ·· Year navigator
        const yearHeadings = [...document.querySelectorAll('.year-heading')];
        if (yearHeadings.length) {
            yearHeadings.forEach(h => { h.id = 'y' + h.textContent.trim(); });

            const nav = document.createElement('nav');
            nav.className = 'year-nav';
            nav.setAttribute('aria-label', 'Jump to year');

            yearHeadings.forEach(h => {
                const a = document.createElement('a');
                a.href = '#' + h.id;
                a.className = 'year-pill';
                a.textContent = h.textContent.trim();
                a.addEventListener('click', e => {
                    e.preventDefault();
                    h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                nav.appendChild(a);
            });

            const ref = document.querySelector('.pub-search-wrap') || pageHeader;
            if (ref) ref.after(nav);

            // Highlight pill matching the year currently in view
            const pillObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    nav.querySelectorAll('.year-pill').forEach(p => p.classList.remove('active'));
                    const pill = nav.querySelector(`[href="#${e.target.id}"]`);
                    if (pill) {
                        pill.classList.add('active');
                        pill.scrollIntoView({ block: 'nearest', inline: 'center' });
                    }
                });
            }, { rootMargin: '-5% 0px -85% 0px' });

            yearHeadings.forEach(h => pillObs.observe(h));
        }
    }

    // ── Scroll-reveal (runs last so it sees all injected nodes) ───
    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.classList.add('is-revealed');
                revealObs.unobserve(e.target);
            });
        }, { threshold: 0.04, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.content-area > *').forEach((el, i) => {
            el.style.setProperty('--rd', Math.min(i * 55, 200) + 'ms');
            el.classList.add('will-reveal');
            revealObs.observe(el);
        });
    }

})();
