/**
 * VANESSA'S BOOK STORE — APPLICATION LOGIC
 * Authentic personal bookshelf catalog with real book covers and dark themes.
 * Zero emojis, zero pill-capsules, clean typography.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Realistic Book Dataset with Real Cover Images ---
  const initialBooks = [
    {
      id: 1,
      title: "Before the Coffee Gets Cold",
      author: "Toshikazu Kawaguchi",
      year: 2015,
      category: "Fiction",
      status: "Reading",
      statusLabel: "Currently Reading",
      rating: 4.8,
      pages: 213,
      coverImg: "assets/covers/coffee.jpg",
      synopsis: "In a quiet back alley in Tokyo, a small cafe offers its customers the chance to travel back in time, under strict rules before the coffee gets cold."
    },
    {
      id: 2,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      year: 2021,
      category: "Fiction",
      status: "Finished",
      statusLabel: "Finished",
      rating: 4.9,
      pages: 303,
      coverImg: "assets/covers/klara.jpg",
      synopsis: "The unforgettable narrative of Klara, an Artificial Friend who carefully observes the human world and explores the deeper questions of love."
    },
    {
      id: 3,
      title: "Braiding Sweetgrass",
      author: "Robin Wall Kimmerer",
      year: 2013,
      category: "Essays & Nature",
      status: "Finished",
      statusLabel: "Finished",
      rating: 5.0,
      pages: 390,
      coverImg: "assets/covers/sweetgrass.jpg",
      synopsis: "An indigenous botanist explores how ecological wisdom, plant sentience, and ancient traditions can restore our relationship with the living world."
    },
    {
      id: 4,
      title: "Crying in H Mart",
      author: "Michelle Zauner",
      year: 2021,
      category: "Memoir",
      status: "Finished",
      statusLabel: "Finished",
      rating: 4.9,
      pages: 256,
      coverImg: "assets/covers/hmart.jpg",
      synopsis: "A deeply moving memoir about growing up Korean American, family, food, maternal loss, and forging personal identity."
    },
    {
      id: 5,
      title: "Meditations",
      author: "Marcus Aurelius",
      year: 180,
      category: "Philosophy",
      status: "Finished",
      statusLabel: "Finished",
      rating: 4.8,
      pages: 254,
      coverImg: "assets/covers/meditations.jpg",
      synopsis: "Private journal entries of the Roman emperor on stoicism, ethical duty, emotional resilience, and rational clarity."
    },
    {
      id: 6,
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      year: 2022,
      category: "Fiction",
      status: "Finished",
      statusLabel: "Finished",
      rating: 4.8,
      pages: 416,
      coverImg: "assets/covers/tomorrow.jpg",
      synopsis: "A sprawling story of two lifelong friends who collaborate to build acclaimed video games, exploring artistry, fame, and deep companionship."
    },
    {
      id: 7,
      title: "The Secret History",
      author: "Donna Tartt",
      year: 1992,
      category: "Classics",
      status: "Finished",
      statusLabel: "Finished",
      rating: 4.7,
      pages: 559,
      coverImg: "assets/covers/secrethistory.jpg",
      synopsis: "A group of clever, eccentric misfits studying ancient Greek at an elite New England college descend into darkness, obsession, and murder."
    },
    {
      id: 8,
      title: "Silent Spring",
      author: "Rachel Carson",
      year: 1962,
      category: "Essays & Nature",
      status: "Wishlist",
      statusLabel: "On Wishlist",
      rating: 4.9,
      pages: 378,
      coverImg: "assets/covers/silentspring.jpg",
      synopsis: "The landmark environmental book that exposed the destructive effects of synthetic pesticides and transformed ecological consciousness."
    }
  ];

  let storeBooks = [...initialBooks];
  let activeGenre = "All";
  let activeStatus = "All";
  let searchKeyword = "";

  // Elements
  const storeGrid = document.getElementById('store-grid');
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  const genrePills = document.querySelectorAll('.genre-pill');
  const catalogCountEl = document.getElementById('catalog-count');

  // Stats
  const statTotal = document.getElementById('dash-total-books');
  const statFinished = document.getElementById('dash-finished-books');
  const statActive = document.getElementById('dash-active-reading');
  const statWishlist = document.getElementById('dash-wishlist-books');

  // Modals & Controls
  const addBookModal = document.getElementById('add-book-modal');
  const detailsModal = document.getElementById('details-modal');
  const detailsBody = document.getElementById('details-body');
  const addBookForm = document.getElementById('add-book-form');
  const preferencesForm = document.getElementById('preferences-form');
  const themeSwitcher = document.getElementById('theme-switcher');
  const toast = document.getElementById('toast');

  // --- 2. Dark/Light Palette Theme Switcher ---
  if (themeSwitcher) {
    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    const docTheme = document.documentElement.getAttribute('data-theme');
    const activeTheme = urlTheme || docTheme || localStorage.getItem('vanessa_theme') || 'navy';
    
    themeSwitcher.value = activeTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);

    themeSwitcher.addEventListener('change', (e) => {
      const selected = e.target.value;
      document.documentElement.setAttribute('data-theme', selected);
      localStorage.setItem('vanessa_theme', selected);
      showToast(`Theme updated: ${themeSwitcher.options[themeSwitcher.selectedIndex].text}`);
    });
  }

  // --- 3. Toast Feedback (No Emoji) ---
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // --- 4. Sticky Header Active Links on Scroll ---
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-panel a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobilePanel = document.getElementById('mobile-nav-panel');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
    });
    mobilePanel.querySelectorAll('a').forEach(l => {
      l.addEventListener('click', () => mobilePanel.classList.remove('open'));
    });
  }

  // --- 5. Dashboard Counters ---
  function updateDashboard() {
    const total = storeBooks.length;
    const finished = storeBooks.filter(b => b.status === 'Finished').length;
    const reading = storeBooks.filter(b => b.status === 'Reading').length;
    const wishlist = storeBooks.filter(b => b.status === 'Wishlist').length;

    if (statTotal) statTotal.textContent = total;
    if (statFinished) statFinished.textContent = finished;
    if (statActive) statActive.textContent = reading;
    if (statWishlist) statWishlist.textContent = wishlist;
  }

  // --- 6. Render Book Catalog Grid (Real Covers, Clean Ratings, Zero Pills) ---
  function renderCatalog() {
    if (!storeGrid) return;

    const filtered = storeBooks.filter(book => {
      const matchGenre = activeGenre === "All" || book.category.toLowerCase().includes(activeGenre.toLowerCase());
      const matchStatus = activeStatus === "All" || book.status.toLowerCase() === activeStatus.toLowerCase();
      const q = searchKeyword.toLowerCase();
      const matchSearch = book.title.toLowerCase().includes(q) ||
                          book.author.toLowerCase().includes(q) ||
                          book.category.toLowerCase().includes(q);

      return matchGenre && matchStatus && matchSearch;
    });

    if (catalogCountEl) {
      catalogCountEl.textContent = `Showing ${filtered.length} of ${storeBooks.length} books on shelf`;
    }

    if (filtered.length === 0) {
      storeGrid.innerHTML = `
        <div class="store-empty-state">
          <p style="font-size: 1.05rem; font-weight: 500; color: var(--text-primary); margin-bottom: 4px;">No books match your criteria</p>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">Try adjusting keywords or genre filters.</p>
          <button class="btn btn-secondary" id="btn-reset-filters">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchKeyword = '';
          if (statusFilter) statusFilter.value = 'All';
          activeStatus = 'All';
          activeGenre = 'All';
          genrePills.forEach(p => p.classList.toggle('active', p.dataset.category === 'All'));
          renderCatalog();
        });
      }
      return;
    }

    storeGrid.innerHTML = filtered.map(book => {
      const statusClass = book.status === 'Finished' ? 'status-finished' :
                          book.status === 'Reading' ? 'status-reading' : 'status-wishlist';

      return `
        <article class="store-book-card" data-id="${book.id}">
          <div class="store-cover-wrap">
            <img src="${book.coverImg}" class="store-cover-image" alt="${escapeHtml(book.title)} Cover" loading="lazy">
          </div>

          <span class="card-book-genre">${escapeHtml(book.category)}</span>
          <h3 class="card-book-title">${escapeHtml(book.title)}</h3>
          <p class="card-book-author">by ${escapeHtml(book.author)} (${book.year})</p>

          <div class="card-book-meta">
            <span class="clean-status ${statusClass}">${escapeHtml(book.statusLabel)}</span>
            <span class="clean-rating">Rating: ${book.rating.toFixed(1)} / 5</span>
          </div>

          <div class="card-actions-row">
            <button type="button" class="btn btn-secondary btn-card-details btn-view-book" data-id="${book.id}">
              View Book Record
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners
    document.querySelectorAll('.btn-view-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        const book = storeBooks.find(b => b.id === id);
        if (book) showBookDetails(book);
      });
    });
  }

  // --- 7. Book Details Modal (Simplified, No Vibe-Pills) ---
  function showBookDetails(book) {
    if (!detailsBody || !detailsModal) return;

    detailsBody.innerHTML = `
      <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: flex-start;">
        <img src="${book.coverImg}" style="width: 100px; height: 145px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);" alt="${escapeHtml(book.title)}">
        <div style="flex: 1;">
          <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">${escapeHtml(book.category)}</span>
          <h3 style="font-size: 1.45rem; margin: 4px 0; color: var(--text-primary);">${escapeHtml(book.title)}</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">by ${escapeHtml(book.author)} (${book.year})</p>
          <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6;">
            <p>Status: <strong style="color: var(--text-primary);">${escapeHtml(book.statusLabel)}</strong></p>
            <p>Length: ${book.pages} Pages</p>
            <p>Rating: ${book.rating.toFixed(1)} / 5</p>
          </div>
        </div>
      </div>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: 6px; padding: 14px; margin-bottom: 20px;">
        <strong style="font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 6px;">Synopsis & Notes</strong>
        <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-primary);">
          ${escapeHtml(book.synopsis)}
        </p>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" class="btn btn-secondary" id="btn-close-details-dialog">Close</button>
        <button type="button" class="btn btn-primary" id="btn-toggle-shelf-status">
          ${book.status === 'Reading' ? 'Mark as Finished' : 'Mark as Reading'}
        </button>
      </div>
    `;

    detailsModal.classList.add('active');

    document.getElementById('btn-close-details-dialog').addEventListener('click', () => {
      detailsModal.classList.remove('active');
    });

    document.getElementById('btn-toggle-shelf-status').addEventListener('click', () => {
      if (book.status === 'Reading') {
        book.status = 'Finished';
        book.statusLabel = 'Finished';
        showToast(`Marked "${book.title}" as Finished.`);
      } else {
        book.status = 'Reading';
        book.statusLabel = 'Currently Reading';
        showToast(`Marked "${book.title}" as Currently Reading.`);
      }
      detailsModal.classList.remove('active');
      updateDashboard();
      renderCatalog();
    });
  }

  // --- 8. Filter & Search Handlers ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value.trim();
      renderCatalog();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      activeStatus = e.target.value;
      renderCatalog();
    });
  }

  genrePills.forEach(pill => {
    pill.addEventListener('click', () => {
      genrePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeGenre = pill.dataset.category;
      renderCatalog();
    });
  });

  // --- 9. Modal Toggles ---
  const openAddBtns = document.querySelectorAll('.btn-open-add-book, .btn-add-store');
  const closeModals = document.querySelectorAll('.btn-close-modal, .btn-cancel-modal');

  openAddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (addBookModal) addBookModal.classList.add('active');
    });
  });

  closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
      if (addBookModal) addBookModal.classList.remove('active');
      if (detailsModal) detailsModal.classList.remove('active');
    });
  });

  [addBookModal, detailsModal].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    }
  });

  // --- 10. Add Book Form Submission ---
  if (addBookForm) {
    addBookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('new-book-title').value.trim();
      const author = document.getElementById('new-book-author').value.trim();
      const year = parseInt(document.getElementById('new-book-year').value, 10) || 2026;
      const category = document.getElementById('new-book-category').value;
      const status = document.getElementById('new-book-status').value;
      const rating = parseFloat(document.getElementById('new-book-rating').value) || 5.0;
      const pages = parseInt(document.getElementById('new-book-pages').value, 10) || 300;
      const synopsis = document.getElementById('new-book-synopsis').value.trim() || "Cataloged book record.";

      const availableCovers = [
        'assets/covers/coffee.jpg',
        'assets/covers/klara.jpg',
        'assets/covers/sweetgrass.jpg',
        'assets/covers/hmart.jpg',
        'assets/covers/meditations.jpg',
        'assets/covers/tomorrow.jpg',
        'assets/covers/secrethistory.jpg',
        'assets/covers/silentspring.jpg'
      ];
      const coverImg = availableCovers[Math.floor(Math.random() * availableCovers.length)];

      const statusLabels = {
        'Finished': 'Finished',
        'Reading': 'Currently Reading',
        'Wishlist': 'On Wishlist'
      };

      const newBook = {
        id: Date.now(),
        title,
        author,
        year,
        category,
        status,
        statusLabel: statusLabels[status] || status,
        rating,
        pages,
        coverImg,
        synopsis
      };

      storeBooks.unshift(newBook);
      updateDashboard();
      renderCatalog();
      addBookForm.reset();
      addBookModal.classList.remove('active');

      showToast(`Added "${title}" to your shelf.`);

      const catalogSection = document.getElementById('catalog');
      if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- 11. Preferences Form ---
  if (preferencesForm) {
    preferencesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Store preferences saved successfully.");
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  updateDashboard();
  renderCatalog();
});
