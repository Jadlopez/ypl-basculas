document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('productSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const resultText = document.getElementById('catalogResultText');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const emptyState = document.getElementById('catalogEmpty');

  const productCards = [...document.querySelectorAll('.product-card')];
  const catalogSections = [...document.querySelectorAll('.catalog-section')];

  function normalizeText(text = '') {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function showCard(card, animate = false) {
    card.classList.remove('is-hidden');

    if (!animate) {
      card.classList.remove('is-revealed');
      return;
    }

    card.classList.remove('is-revealed');
    requestAnimationFrame(() => {
      card.classList.add('is-revealed');
    });
  }

  function hideCard(card) {
    card.classList.add('is-hidden');
    card.classList.remove('is-revealed');
  }

  function updateSectionVisibility() {
    catalogSections.forEach((section) => {
      const visibleCards = section.querySelectorAll('.product-card:not(.is-hidden)').length;
      section.classList.toggle('is-hidden', visibleCards === 0);
    });
  }

  function updateToolbarState(searchTerm, currentFilter, visibleCards) {
    const hasSearch = searchTerm.length > 0;
    const hasFilter = currentFilter !== 'all';
    const hasActiveFilters = hasSearch || hasFilter;

    if (searchClearBtn) {
      searchClearBtn.hidden = !hasSearch;
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.hidden = !hasActiveFilters;
    }

    if (resultText) {
      resultText.textContent = `${visibleCards} ${visibleCards === 1 ? 'producto' : 'productos'}`;
    }
  }

  function updateEmptyState(visibleCards) {
    if (emptyState) {
      emptyState.hidden = visibleCards !== 0;
    }
  }

  function updateCatalog({ animate = false } = {}) {
    const rawSearch = searchInput ? searchInput.value : '';
    const searchTerm = normalizeText(rawSearch);
    const currentFilter = categoryFilter ? categoryFilter.value : 'all';

    let visibleCards = 0;

    productCards.forEach((card) => {
      const productName = normalizeText(card.dataset.name || '');
      const productCategory = card.dataset.category || '';
      const productText = normalizeText(card.textContent || '');

      const matchesFilter =
        currentFilter === 'all' || productCategory === currentFilter;

      const matchesSearch =
        searchTerm === '' ||
        productName.includes(searchTerm) ||
        productText.includes(searchTerm);

      const shouldShow = matchesFilter && matchesSearch;

      if (shouldShow) {
        visibleCards += 1;
        showCard(card, animate);
      } else {
        hideCard(card);
      }
    });

    updateSectionVisibility();
    updateToolbarState(searchTerm, currentFilter, visibleCards);
    updateEmptyState(visibleCards);
  }

  function resetCatalog() {
    if (searchInput) {
      searchInput.value = '';
    }

    if (categoryFilter) {
      categoryFilter.value = 'all';
    }

    updateCatalog({ animate: false });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      updateCatalog({ animate: false });
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      updateCatalog({ animate: true });
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (!searchInput) return;
      searchInput.value = '';
      searchInput.focus();
      updateCatalog({ animate: false });
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', resetCatalog);
  }

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', resetCatalog);
  }

  updateCatalog({ animate: false });
});