/**
 * Dossier Wiki Application
 * Main application controller for the wiki interface
 */

class DossierApp {
  constructor() {
    this.parser = new DossierParser();
    this.dossier = null;
    this.currentDocIndex = 0;
    this.searchQuery = '';
    this.allSections = [];

    // DOM Elements
    this.elements = {
      sidebar: document.getElementById('sidebar'),
      sidebarOverlay: document.getElementById('sidebarOverlay'),
      menuToggle: document.getElementById('menuToggle'),
      themeToggle: document.getElementById('themeToggle'),
      themeToggleMobile: document.getElementById('themeToggleMobile'),
      searchInput: document.getElementById('searchInput'),
      metadataSection: document.getElementById('metadataSection'),
      navTree: document.getElementById('navTree'),
      mainContent: document.getElementById('mainContent'),
      article: document.getElementById('article'),
      loading: document.getElementById('loading'),
      toc: document.getElementById('toc'),
      tocNav: document.getElementById('tocNav'),
      backToTop: document.getElementById('backToTop')
    };

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    this.setupEventListeners();
    this.loadTheme();
    await this.loadDossier();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    this.elements.menuToggle.addEventListener('click', () => this.toggleSidebar());
    this.elements.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    // Theme toggle
    this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
    this.elements.themeToggleMobile?.addEventListener('click', () => this.toggleTheme());

    // Search
    this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

    // Back to top
    window.addEventListener('scroll', () => this.handleScroll());
    this.elements.backToTop.addEventListener('click', () => this.scrollToTop());

    // Handle navigation
    window.addEventListener('hashchange', () => this.handleHashChange());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * Load the dossier XML file
   */
  async loadDossier() {
    try {
      const response = await fetch('../master/dossier_output.xml');
      if (!response.ok) {
        throw new Error(`Failed to load dossier: ${response.status}`);
      }

      const xmlText = await response.text();
      this.dossier = this.parser.parse(xmlText);
      this.allSections = this.parser.getAllSections();

      this.renderMetadata();
      this.renderNavigation();
      this.handleHashChange();

      this.elements.loading.classList.add('hidden');
    } catch (error) {
      console.error('Error loading dossier:', error);
      this.showError(error.message);
    }
  }

  /**
   * Render metadata section
   */
  renderMetadata() {
    const metadata = this.dossier.metadata;
    let html = '';

    for (const [key, value] of Object.entries(metadata)) {
      html += `
        <div class="metadata-item">
          <span class="metadata-key">${this.escapeHtml(key)}:</span>
          <span class="metadata-value">${this.escapeHtml(value)}</span>
        </div>
      `;
    }

    this.elements.metadataSection.innerHTML = html;
  }

  /**
   * Render navigation tree
   */
  renderNavigation() {
    let html = '';

    this.dossier.documents.forEach((doc, index) => {
      const isFirst = index === 0;
      html += `
        <div class="nav-group ${isFirst ? '' : 'collapsed'}" data-doc-index="${index}">
          <div class="nav-group-header" onclick="app.toggleNavGroup(${index})">
            <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
            <span class="nav-group-title">${this.escapeHtml(doc.title)}</span>
          </div>
          <div class="nav-items">
            ${this.renderNavItems(doc.sections, doc.id)}
          </div>
        </div>
      `;
    });

    this.elements.navTree.innerHTML = html;

    // Set max-height for animation
    document.querySelectorAll('.nav-items').forEach(items => {
      items.style.maxHeight = items.scrollHeight + 'px';
    });
  }

  /**
   * Render navigation items recursively
   */
  renderNavItems(sections, docId) {
    let html = '';

    sections.forEach(section => {
      const href = `#${docId}/${section.id}`;
      html += `
        <a href="${href}" class="nav-item" data-section-id="${section.id}">
          ${this.escapeHtml(section.title)}
        </a>
      `;

      if (section.subsections && section.subsections.length > 0) {
        html += this.renderNavItems(section.subsections, docId);
      }
    });

    return html;
  }

  /**
   * Toggle navigation group
   */
  toggleNavGroup(index) {
    const group = document.querySelector(`.nav-group[data-doc-index="${index}"]`);
    if (group) {
      group.classList.toggle('collapsed');
    }
  }

  /**
   * Render a document
   */
  renderDocument(docIndex) {
    const doc = this.dossier.documents[docIndex];
    if (!doc) return;

    this.currentDocIndex = docIndex;

    let html = `
      <header class="document-header">
        <div class="document-source">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          ${this.escapeHtml(doc.sourceFile)}
        </div>
        <h1 class="document-title">${this.escapeHtml(doc.title)}</h1>
      </header>
    `;

    html += this.renderSections(doc.sections, doc.id);

    this.elements.article.innerHTML = html;
    this.renderTableOfContents(doc);
    this.updateActiveNavItem();
  }

  /**
   * Render sections
   */
  renderSections(sections, docId) {
    let html = '';

    sections.forEach(section => {
      html += this.renderSection(section, docId);
    });

    return html;
  }

  /**
   * Render a single section
   */
  renderSection(section, docId) {
    const tag = `h${Math.min(section.level, 4)}`;
    const anchorHref = `#${docId}/${section.id}`;

    let html = `
      <${tag} id="${section.id}" class="section-heading">
        ${this.escapeHtml(section.title)}
        <a href="${anchorHref}" class="heading-anchor" aria-label="Link to section">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </a>
      </${tag}>
    `;

    // Render content
    section.content.forEach(item => {
      html += this.renderContentItem(item);
    });

    // Render subsections
    if (section.subsections && section.subsections.length > 0) {
      html += this.renderSections(section.subsections, docId);
    }

    return html;
  }

  /**
   * Render a content item
   */
  renderContentItem(item) {
    switch (item.type) {
      case 'paragraph':
        return `<p class="paragraph">${this.formatText(item.text)}</p>`;

      case 'datapoint':
        if (item.value) {
          return `
            <div class="data-point">
              <span class="data-point-key">${this.escapeHtml(item.key)}</span>
              <span class="data-point-value">${this.formatText(item.value)}</span>
            </div>
          `;
        } else {
          return `
            <div class="data-point">
              <span class="data-point-key">${this.escapeHtml(item.key)}</span>
            </div>
          `;
        }

      case 'list':
        const tag = item.ordered ? 'ol' : 'ul';
        const className = item.ordered ? 'content-list ordered' : 'content-list';
        let listHtml = `<${tag} class="${className}">`;
        item.items.forEach(listItem => {
          listHtml += `<li>${this.formatText(listItem)}</li>`;
        });
        listHtml += `</${tag}>`;
        return listHtml;

      default:
        return '';
    }
  }

  /**
   * Format text with basic styling
   */
  formatText(text) {
    if (!text) return '';

    let html = this.escapeHtml(text);

    // Highlight search terms if searching
    if (this.searchQuery) {
      const regex = new RegExp(`(${this.escapeRegex(this.searchQuery)})`, 'gi');
      html = html.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Basic formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<em>$1</em>');

    return html;
  }

  /**
   * Render table of contents
   */
  renderTableOfContents(doc) {
    let html = '';

    const renderTocItem = (section, depth = 1) => {
      html += `
        <a href="#${section.id}" class="level-${depth}" data-section-id="${section.id}">
          ${this.escapeHtml(section.title)}
        </a>
      `;

      if (section.subsections && depth < 3) {
        section.subsections.forEach(sub => renderTocItem(sub, depth + 1));
      }
    };

    doc.sections.forEach(section => renderTocItem(section));

    this.elements.tocNav.innerHTML = html;
    this.setupTocObserver();
  }

  /**
   * Setup intersection observer for TOC highlighting
   */
  setupTocObserver() {
    const headings = document.querySelectorAll('.section-heading');
    const tocLinks = document.querySelectorAll('.toc-nav a');

    if (!headings.length || !tocLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('data-section-id') === id);
            });
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    );

    headings.forEach(heading => observer.observe(heading));
  }

  /**
   * Handle URL hash changes
   */
  handleHashChange() {
    const hash = window.location.hash.slice(1);

    if (!hash) {
      // Load first document if no hash
      this.renderDocument(0);
      return;
    }

    const [docId, sectionId] = hash.split('/');

    // Find document by ID
    const docIndex = this.dossier.documents.findIndex(d => d.id === docId);

    if (docIndex >= 0) {
      if (docIndex !== this.currentDocIndex) {
        this.renderDocument(docIndex);
      }

      // Scroll to section if specified
      if (sectionId) {
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }

    this.closeSidebar();
  }

  /**
   * Update active navigation item
   */
  updateActiveNavItem() {
    const navItems = document.querySelectorAll('.nav-item');
    const hash = window.location.hash;

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === hash);
    });
  }

  /**
   * Handle search input
   */
  handleSearch(query) {
    this.searchQuery = query.trim().toLowerCase();

    if (!this.searchQuery) {
      this.renderNavigation();
      if (this.currentDocIndex >= 0) {
        this.renderDocument(this.currentDocIndex);
      }
      return;
    }

    // Filter sections
    const results = this.allSections.filter(section =>
      section.searchText.includes(this.searchQuery)
    );

    this.renderSearchResults(results);
  }

  /**
   * Render search results
   */
  renderSearchResults(results) {
    if (results.length === 0) {
      this.elements.navTree.innerHTML = `
        <div class="search-no-results">
          <p>Nenhum resultado para "${this.escapeHtml(this.searchQuery)}"</p>
        </div>
      `;
      return;
    }

    let html = '';
    let currentDocId = null;

    results.forEach(section => {
      if (section.documentId !== currentDocId) {
        if (currentDocId !== null) {
          html += '</div></div>';
        }
        currentDocId = section.documentId;
        const doc = this.dossier.documents.find(d => d.id === currentDocId);
        html += `
          <div class="nav-group">
            <div class="nav-group-header">
              <span class="nav-group-title">${this.escapeHtml(doc?.title || 'Document')}</span>
            </div>
            <div class="nav-items" style="max-height: 1000px;">
        `;
      }

      html += `
        <a href="#${section.documentId}/${section.id}" class="nav-item">
          ${this.escapeHtml(section.title)}
        </a>
      `;
    });

    if (currentDocId !== null) {
      html += '</div></div>';
    }

    this.elements.navTree.innerHTML = html;
  }

  /**
   * Toggle sidebar (mobile)
   */
  toggleSidebar() {
    this.elements.sidebar.classList.toggle('open');
    this.elements.sidebarOverlay.classList.toggle('active');
    this.elements.menuToggle.classList.toggle('menu-open');
    document.body.style.overflow = this.elements.sidebar.classList.contains('open') ? 'hidden' : '';
  }

  /**
   * Close sidebar
   */
  closeSidebar() {
    this.elements.sidebar.classList.remove('open');
    this.elements.sidebarOverlay.classList.remove('active');
    this.elements.menuToggle.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dossier-theme', newTheme);
  }

  /**
   * Load saved theme
   */
  loadTheme() {
    const savedTheme = localStorage.getItem('dossier-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrolled = window.scrollY > 300;
    this.elements.backToTop.classList.toggle('visible', scrolled);
  }

  /**
   * Scroll to top
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboard(e) {
    // Focus search on Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.elements.searchInput.focus();
    }

    // Close sidebar on Escape
    if (e.key === 'Escape') {
      this.closeSidebar();
      this.elements.searchInput.blur();
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    this.elements.loading.innerHTML = `
      <div style="color: var(--color-danger); text-align: center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p><strong>Erro ao carregar dossier</strong></p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Escape regex special characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Initialize app
const app = new DossierApp();
