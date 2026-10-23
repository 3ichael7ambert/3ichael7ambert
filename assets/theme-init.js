// A tiny early script avoids a flash of the wrong theme; storage can be blocked.
(() => {
  const q = new URLSearchParams(location.search);
  const has = key => q.has(key) || [...q.values()].some(v => v.split(/[ ,+]/).includes(key));
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('portfolio-appearance') || '{}'); } catch {}
  if (!saved || typeof saved !== 'object') saved = {};
  const allowed = ['sketchbook', 'light', 'dark', 'music', 'art'];
  const requested = q.get('theme');
  const explicit = allowed.includes(requested) ? requested : has('sketchbook') ? 'sketchbook' : has('dark') ? 'dark' : has('music') || has('musicBG') ? 'music' : has('art') ? 'art' : null;
  const theme = explicit || (allowed.includes(saved.theme) ? saved.theme : 'sketchbook');
  document.documentElement.dataset.theme = theme;
  window.portfolioAppearance = { theme, weather: has('snow') ? 'snow' : has('rain') ? 'rain' : ['none','rain','snow'].includes(saved.weather) ? saved.weather : 'none', pencil: has('pencil') || has('art') || has('sketchbook') || (typeof saved.pencil === 'boolean' ? saved.pencil : theme === 'sketchbook'), motion: saved.motion !== false };
})();
