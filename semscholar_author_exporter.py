import json
from collections import defaultdict
from semanticscholar import SemanticScholar

# --- 1. CONFIGURATION ---
AUTHOR_NAME = 'Anjith George'
OUTPUT_FILE = 'publications.html'

# --- 2. DEFINE THE HTML TEMPLATES (The Modern Theme) ---

HTML_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Anjith George - Publications">
    <meta name="author" content="Anjith George">
    <title>Anjith George | Publications</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700&display=swap" rel="stylesheet">

    <style>
        /* --- THEME VARIABLES --- */
        :root {
            /* Dark Mode (Default) */
            --bg-color: #0f1115;
            --card-bg: rgba(30, 34, 40, 0.6);
            --text-main: #ffffff;
            --text-muted: #a0a0a0;
            --accent: #3b82f6; 
            --accent-glow: rgba(59, 130, 246, 0.2);
            --border: rgba(255, 255, 255, 0.1);
            --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            --gradient-overlay: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%);
        }

        /* Light Mode Override */
        body.light-mode {
            --bg-color: #f3f4f6;
            --card-bg: rgba(255, 255, 255, 0.8);
            --text-main: #1f2937;
            --text-muted: #6b7280;
            --accent: #2563eb;
            --accent-glow: rgba(37, 99, 235, 0.1);
            --border: rgba(0, 0, 0, 0.05);
            --shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
            --gradient-overlay: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.08), transparent 70%);
        }

        /* --- GLOBAL RESET --- */
        * { margin: 0; padding: 0; box-sizing: border-box; transition: background 0.3s, color 0.3s, border-color 0.3s; }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 40px 20px;
            background-image: var(--gradient-overlay);
            background-attachment: fixed;
        }

        a { text-decoration: none; color: inherit; }

        /* --- LAYOUT CONTAINER --- */
        .container {
            max-width: 1100px;
            width: 100%;
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 40px;
        }

        /* --- SIDEBAR --- */
        .sidebar {
            position: sticky;
            top: 40px;
            height: fit-content;
        }

        .profile-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 30px;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow);
            margin-bottom: 20px;
        }

        .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--card-bg);
            box-shadow: 0 0 0 2px var(--accent);
            margin-bottom: 15px;
        }

        .name { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
        .role { font-size: 0.85rem; color: var(--accent); font-weight: 600; margin-bottom: 20px; }

        .nav-menu { list-style: none; text-align: left; padding-top: 20px; border-top: 1px solid var(--border); }
        .nav-item { margin-bottom: 10px; }
        .nav-link {
            display: block;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.95rem;
            color: var(--text-muted);
            transition: all 0.2s;
        }
        .nav-link:hover, .nav-link.active {
            background: var(--accent-glow);
            color: var(--accent);
        }
        .nav-link.active { font-weight: 600; }

        /* --- CONTENT AREA --- */
        .content-area {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .page-header {
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
        }

        .page-title { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
        .page-subtitle { color: var(--text-muted); }

        /* --- PUBLICATION STYLES --- */
        .year-heading {
            font-family: 'Outfit', sans-serif;
            font-size: 1.8rem;
            color: var(--accent);
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border);
        }

        details {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        details:hover {
            border-color: var(--accent);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        details[open] {
            border-left: 4px solid var(--accent);
        }

        summary {
            font-size: 1rem;
            line-height: 1.5;
            list-style: none;
            position: relative;
            padding-right: 30px;
        }

        summary::after {
            content: '\\f078';
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            position: absolute;
            right: 0;
            top: 0;
            color: var(--text-muted);
            transition: transform 0.3s;
        }

        details[open] summary::after { transform: rotate(180deg); }

        .my-name { font-weight: 700; color: var(--text-main); }
        .paper-title { font-weight: 700; color: var(--text-main); display: block; margin-bottom: 5px; font-size: 1.1rem; }
        .venue { font-style: italic; color: var(--text-muted); font-size: 0.95rem; }

        .links-row { margin-top: 10px; display: flex; gap: 10px; }
        
        .badge-link {
            font-size: 0.75rem;
            padding: 4px 10px;
            border-radius: 4px;
            background: var(--bg-color);
            border: 1px solid var(--border);
            color: var(--text-muted);
            font-weight: 600;
        }
        
        .badge-link:hover {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
        }

        .abstract-box {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--border);
            color: var(--text-muted);
            font-size: 0.95rem;
            line-height: 1.6;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        .theme-toggle {
            position: fixed; top: 20px; right: 20px;
            width: 44px; height: 44px;
            border-radius: 50%;
            background: var(--card-bg);
            border: 1px solid var(--border);
            color: var(--text-main);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 100;
            backdrop-filter: blur(10px);
            font-size: 1.2rem;
        }

        @media (max-width: 850px) {
            .container { grid-template-columns: 1fr; }
            .sidebar { position: relative; top: 0; }
            .nav-menu { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        }
    </style>
</head>
<body>
"""

HTML_BODY_START = """
    <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">
        <i class="fa-solid fa-moon"></i>
    </button>

    <div class="container">
        
        <aside class="sidebar">
            <div class="profile-card">
                <a href="index.html">
                    <img src="Figures/anjith.png" alt="Anjith George" class="avatar">
                </a>
                <h2 class="name">Anjith George</h2>
                <p class="role">Research Associate, IDIAP</p>
                
                <ul class="nav-menu">
                    <li class="nav-item"><a href="index.html" class="nav-link"><i class="fa-solid fa-house"></i> About</a></li>
                    <li class="nav-item"><a href="research.html" class="nav-link"><i class="fa-solid fa-microchip"></i> Research</a></li>
                    <li class="nav-item"><a href="publications.html" class="nav-link active"><i class="fa-solid fa-book-open"></i> Publications</a></li>
                    <li class="nav-item"><a href="resume.html" class="nav-link"><i class="fa-solid fa-file-lines"></i> CV</a></li>
                    <li class="nav-item"><a href="resources.html" class="nav-link"><i class="fa-solid fa-box-archive"></i> Resources</a></li>
                </ul>
            </div>
        </aside>

        <main class="content-area">
            
            <div class="page-header">
                <h1 class="page-title">Publications</h1>
                <p class="page-subtitle">A collection of selected research papers and conference proceedings.</p>
            </div>
"""

HTML_FOOTER = """
        </main>
    </div>

    <script>
        // Check for saved theme preference or default to dark
        const currentTheme = localStorage.getItem('theme');
        const toggleBtnIcon = document.querySelector('.theme-toggle i');

        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
            toggleBtnIcon.classList.remove('fa-moon');
            toggleBtnIcon.classList.add('fa-sun');
        }

        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
                toggleBtnIcon.classList.remove('fa-moon');
                toggleBtnIcon.classList.add('fa-sun');
            } else {
                toggleBtnIcon.classList.remove('fa-sun');
                toggleBtnIcon.classList.add('fa-moon');
            }
            
            localStorage.setItem('theme', theme);
        }
    </script>
</body>
</html>
"""

# --- 3. FETCH DATA ---
print(f"Fetching papers for {AUTHOR_NAME}...")
sch = SemanticScholar()
results = sch.search_author(AUTHOR_NAME)
print(f'{results.total} results found on API.')

papers = []
for res in results:
    papers.extend(res['papers'])

print(f'{len(papers)} papers retrieved.')

# Sort by year (descending)
papers = sorted(papers, key=lambda x: x.get('year', 0) if x.get('year') else 0, reverse=True)

# Group by Year
papers_by_year = defaultdict(list)
for paper in papers:
    # Use 0 if year is missing so it goes to the bottom
    year = paper.get('year')
    if year is None:
        year = "Unknown"
    papers_by_year[year].append(paper)

sorted_years = sorted([y for y in papers_by_year.keys() if isinstance(y, int)], reverse=True)
if "Unknown" in papers_by_year:
    sorted_years.append("Unknown")


# --- 4. GENERATE CONTENT LOOP ---

content_html = ""

for year in sorted_years:
    content_html += f'<h2 class="year-heading">{year}</h2>\n'
    
    for paper in papers_by_year[year]:
        # Data Extraction
        title = paper.get('title', 'No Title')
        venue = paper.get('venue', 'Unknown Venue')
        if not venue: venue = "Unknown Venue"
        
        abstract = paper.get('abstract')
        if not abstract:
            abstract = "No abstract available for this publication."
            
        url = paper.get('url')
        if not url and paper.get('openAccessPdf'):
            url = paper['openAccessPdf'].get('url')
            
        # Extract DOI safely
        doi = None
        if paper.get('externalIds'):
            doi = paper['externalIds'].get('DOI')

        # Format Authors
        author_list = []
        for author in paper.get('authors', []):
            name = author.get('name', '')
            if AUTHOR_NAME.lower() in name.lower():
                # Apply the CSS class for self-highlighting
                author_list.append(f'<span class="my-name">{name}</span>')
            else:
                author_list.append(name)
        
        authors_formatted = ", ".join(author_list)

        # Build Links HTML
        links_html = '<div class="links-row">'
        if doi:
            links_html += f'<a href="https://doi.org/{doi}" class="badge-link" target="_blank">DOI</a>'
        if url:
             links_html += f'<a href="{url}" class="badge-link" target="_blank">URL</a>'
        links_html += '</div>'

        # Build the Card HTML
        content_html += f"""
            <details>
                <summary>
                    <span class="paper-title">{title}</span>
                    {authors_formatted} <br>
                    <span class="venue">{venue}, {year}</span>
                </summary>
                {links_html}
                <div class="abstract-box">
                    {abstract}
                </div>
            </details>
        """

# --- 5. WRITE TO FILE ---
full_html = HTML_HEAD + HTML_BODY_START + content_html + HTML_FOOTER

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"Successfully generated {OUTPUT_FILE} with modern theme!")