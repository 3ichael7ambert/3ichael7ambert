(() => {
  const picker = document.querySelector('[data-studio-theme]');
  const appearance = window.portfolioAppearance;
  if (picker && appearance) {
    picker.value = appearance.theme;
    picker.closest('label').hidden = false;
    picker.addEventListener('change', () => {
      appearance.theme = picker.value;
      window.applyPortfolioTheme(picker.value);
      try { localStorage.setItem('portfolio-appearance', JSON.stringify(appearance)); } catch {}
    });
  }
  const filter = document.querySelector('[data-release-search]');
  if (!filter) return;
  const cards = [...document.querySelectorAll('[data-release-card]')];
  const result = document.querySelector('[data-release-status]');
  filter.closest('label').hidden = false;
  filter.addEventListener('input', () => {
    const query = filter.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const card of cards) {
      card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
      if (!card.hidden) count++;
    }
    result.textContent = query ? `${count} matching editions` : '';
  });
})();
