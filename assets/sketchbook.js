(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const turnLinks = document.querySelectorAll('[data-page-turn]');
  const animations = new WeakMap();

  for (const link of turnLinks) {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
          event.shiftKey || event.altKey) return;

      const chapter = document.getElementById(link.hash.slice(1));
      const heading = chapter?.querySelector('h1, h2');
      if (!heading) return;

      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      if (reduceMotion.matches || !window.portfolioAppearance?.motion ||
          navigator.connection?.saveData || !heading.animate) return;

      animations.get(heading)?.cancel();
      animations.set(heading, heading.animate(
        [{ opacity: 0.45, translate: '.5rem 0' }, { opacity: 1, translate: '0 0' }],
        { duration: 300, easing: 'ease-out' }
      ));
    });
  }
})();
