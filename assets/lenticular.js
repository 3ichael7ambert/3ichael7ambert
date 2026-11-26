(() => {
  const cards = document.querySelectorAll('[data-lenticular]');
  cards.forEach(card => {
    const face = card.querySelector('.lenticular-face');
    const images = [...face.querySelectorAll('img')];
    const slider = card.querySelector('input[type="range"]');
    const tilt = card.querySelector('[data-tilt]');
    const status = card.querySelector('[data-motion-status]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = matchMedia('(pointer: coarse)');
    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
    const motionApi = window.DeviceOrientationEvent;
    let current = Number(slider.value) / 100;
    let target = current;
    let vertical = 0;
    let targetY = 0;
    let request = 0;
    let lastTime = 0;
    let neutral = null;
    let tiltActive = false;
    let sensorTimeout;

    function paint() {
      const index = current * (images.length - 1);
      const lower = Math.floor(index);
      const t = index - lower;
      const blend = t * t * (3 - 2 * t);
      images.forEach((image, i) => {
        image.style.opacity = i === lower ? '1' : i === lower + 1 ? String(blend) : '0';
      });
      const horizontal = current - .5;
      face.style.setProperty('--rx', `${-vertical * 6}deg`);
      face.style.setProperty('--ry', `${horizontal * 15}deg`);
      face.style.setProperty('--shine-x', `${-horizontal * 90}%`);
      face.style.setProperty('--shine-y', `${vertical * 25}%`);
    }

    function tick(time) {
      const delta = lastTime ? Math.min(time - lastTime, 48) : 16;
      lastTime = time;
      const factor = reduced.matches ? 1 : 1 - Math.exp(-delta / 75);
      current += (target - current) * factor;
      vertical += (targetY - vertical) * factor;
      if (Math.abs(target - current) + Math.abs(targetY - vertical) > .001) {
        request = requestAnimationFrame(tick);
      } else {
        current = target;
        vertical = targetY;
        lastTime = 0;
        request = 0;
      }
      paint();
    }

    function move(x, y = 0) {
      target = clamp(x);
      targetY = reduced.matches ? 0 : clamp(y, -.5, .5);
      if (!request) request = requestAnimationFrame(tick);
    }

    const degrees = Math.PI / 180;
    function onTilt(event) {
      if (reduced.matches || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
      clearTimeout(sensorTimeout);
      const beta = event.beta * degrees;
      const gamma = event.gamma * degrees;
      const angle = (screen.orientation?.angle ?? window.orientation ?? 0) * degrees;
      const x = Math.sin(gamma) * Math.cos(beta);
      const y = Math.sin(beta);
      // Project gravity into the current screen axes so landscape tilts track the portrait.
      const horizontal = x * Math.cos(angle) + y * Math.sin(angle);
      const verticalTilt = -x * Math.sin(angle) + y * Math.cos(angle);
      if (!neutral || angle !== neutral.angle) neutral = { angle, horizontal, verticalTilt };
      const roll = (event.gamma - (neutral.gamma ?? event.gamma)) / 44;
      neutral.gamma ??= event.gamma;
      move(.5 + (horizontal - neutral.horizontal) * 1.8 + roll * Math.cos(angle) * .55,
        (verticalTilt - neutral.verticalTilt) * 1.4);
    }

    function stopTilt(message = '') {
      clearTimeout(sensorTimeout);
      window.removeEventListener('deviceorientation', onTilt);
      tiltActive = false;
      neutral = null;
      tilt.setAttribute('aria-pressed', 'false');
      tilt.textContent = 'Enable tilt';
      status.textContent = message;
    }

    tilt.hidden = !motionApi || !window.isSecureContext || !coarse.matches || reduced.matches;
    tilt.addEventListener('click', async () => {
      if (tiltActive) { stopTilt(); return; }
      tilt.disabled = true;
      try {
        if (typeof motionApi.requestPermission === 'function' &&
            await motionApi.requestPermission() !== 'granted') {
          stopTilt('Motion access was declined. Use the slider or swipe the portrait.');
          return;
        }
        if (reduced.matches) return;
        tiltActive = true;
        tilt.setAttribute('aria-pressed', 'true');
        tilt.textContent = 'Disable tilt';
        status.textContent = 'Hold your phone comfortably, then tilt it left or right.';
        window.addEventListener('deviceorientation', onTilt, { passive: true });
        sensorTimeout = setTimeout(() => stopTilt('Motion is unavailable. Use the slider or swipe the portrait.'), 2500);
      } catch {
        stopTilt('Motion is unavailable. Use the slider or swipe the portrait.');
      } finally { tilt.disabled = false; }
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) stopTilt();
      tilt.hidden = !motionApi || !window.isSecureContext || !coarse.matches || reduced.matches;
      move(Number(slider.value) / 100);
    });
    face.addEventListener('pointermove', event => {
      if (reduced.matches || tiltActive || event.pointerType === 'touch' && !face.hasPointerCapture(event.pointerId)) return;
      const box = card.querySelector('.lenticular-stage').getBoundingClientRect();
      move((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height - .5);
    });
    face.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && !reduced.matches) {
        if (tiltActive) stopTilt();
        face.setPointerCapture(event.pointerId);
      }
    });
    face.addEventListener('pointerleave', event => {
      if (!tiltActive && event.pointerType !== 'touch') move(Number(slider.value) / 100);
    });
    slider.addEventListener('input', () => {
      if (tiltActive) stopTilt();
      move(Number(slider.value) / 100);
    });
    paint();
  });
})();
