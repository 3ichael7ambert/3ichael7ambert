(() => {
  const data = document.querySelector('#depth-data');
  if (!data) return;
  const scenes = JSON.parse(data.textContent);
  const gallery = document.querySelector('.depth-gallery');
  const stage = gallery.querySelector('.depth-stage');
  const poster = stage.querySelector('img');
  const canvas = stage.querySelector('canvas');
  const flat = gallery.querySelector('[data-depth-flat]');
  const status = gallery.querySelector('[data-depth-status]');
  const button = gallery.querySelector('[data-depth-toggle]');
  const slider = gallery.querySelector('input');
  const tilt = gallery.querySelector('[data-depth-tilt]');
  const fullscreen = gallery.querySelector('[data-depth-full]');
  const exit = gallery.querySelector('[data-depth-close]');
  const dialog = document.querySelector('.depth-dialog');
  const route = gallery.querySelector('.depth-route');
  const origin = document.createComment('depth gallery');
  gallery.before(origin);
  const controls = gallery.querySelector('.depth-controls');
  const links = [...document.querySelectorAll('[data-depth-id]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let scene;
  let active = false;
  let autoStart = true;
  let revision = 0;
  let renderer;
  let frame = 0;
  let x = 0;
  let y = 0;
  let tiltActive = false;
  let tiltTimer;
  let neutral;
  let fullscreenRequest = 0;
  let nativeFullscreen = false;
  const motion = window.DeviceOrientationEvent;
  const wrapAngle = degrees => ((degrees + 540) % 360) - 180;

  function canTilt() {
    return motion && window.isSecureContext && navigator.maxTouchPoints > 0 && !reduced.matches;
  }

  function stopTilt() {
    clearTimeout(tiltTimer);
    window.removeEventListener('deviceorientation', onTilt);
    neutral = undefined;
    tiltActive = false;
    tilt.textContent = 'Enable tilt';
    tilt.setAttribute('aria-pressed', 'false');
  }

  function onTilt(event) {
    if (!active || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    clearTimeout(tiltTimer);
    const orientation = screen.orientation?.angle ?? window.orientation ?? 0;
    if (!neutral || neutral.orientation !== orientation) {
      neutral = { beta: event.beta, gamma: event.gamma, orientation };
      x = y = 0;
      status.textContent = 'Tilt your phone to move the image.';
    }
    const angle = orientation * Math.PI / 180;
    const side = wrapAngle(event.gamma - neutral.gamma);
    const pitch = wrapAngle(event.beta - neutral.beta);
    const nextX = clamp((side * Math.cos(angle) + pitch * Math.sin(angle)) / 24, -1, 1);
    const nextY = clamp((pitch * Math.cos(angle) - side * Math.sin(angle)) / 24, -1, 1);
    x += (nextX - x) * .38;
    y += (nextY - y) * .38;
    draw();
  }

  async function enableTilt() {
    tilt.disabled = true;
    try {
      if (typeof motion.requestPermission === 'function' && await motion.requestPermission() !== 'granted') {
        status.textContent = 'Motion access was declined. Drag the image or use the slider.';
        return;
      }
      if (!canTilt()) return;
      if (!active) {
        setActive(true);
        await activate();
        if (!active || !canTilt()) return;
      }
      tiltActive = true;
      tilt.textContent = 'Disable tilt';
      tilt.setAttribute('aria-pressed', 'true');
      status.textContent = 'Hold your phone comfortably to center the view.';
      window.addEventListener('deviceorientation', onTilt, { passive: true });
      tiltTimer = setTimeout(() => {
        stopTilt();
        status.textContent = 'Motion is unavailable. Drag the image or use the slider.';
      }, 2500);
    } catch {
      stopTilt();
      status.textContent = 'Motion is unavailable. Drag the image or use the slider.';
    } finally {
      tilt.disabled = false;
    }
  }

  function makeRenderer() {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) throw new Error('WebGL is unavailable');
    const program = gl.createProgram();
    const vertex = `
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = position * vec2(0.5, -0.5) + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const fragment = `
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D picture;
      uniform sampler2D depthMap;
      uniform vec2 angle;
      void main() {
        vec2 base = uv * 0.95 + 0.025;
        vec2 sampleAt = base;
        for (int step = 0; step < 3; step++) {
          float depth = texture2D(depthMap, sampleAt).r;
          sampleAt = clamp(base + (depth - 0.5) * angle, vec2(0.002), vec2(0.998));
        }
        gl_FragColor = texture2D(picture, sampleAt);
      }
    `;
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Depth shader is unavailable');
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Depth renderer is unavailable');
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const textures = ['picture', 'depthMap'].map((name, index) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, name), index);
      return texture;
    });
    const angle = gl.getUniformLocation(program, 'angle');
    return {
      load(images) {
        images.forEach((image, i) => {
          gl.activeTexture(gl.TEXTURE0 + i);
          gl.bindTexture(gl.TEXTURE_2D, textures[i]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        });
        if (gl.getError() !== gl.NO_ERROR) throw new Error('Depth images could not be read');
      },
      draw() {
        const scale = Math.min(devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(stage.clientWidth * scale));
        const height = Math.max(1, Math.round(stage.clientHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(angle, x * .095, y * .075);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
  }

  function draw() {
    if (!active || canvas.hidden || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (active && !canvas.hidden) renderer.draw();
    });
  }

  function setActive(value) {
    active = value;
    button.textContent = value ? 'Disable depth' : 'Enable depth';
    button.setAttribute('aria-pressed', String(value));
    slider.disabled = !value;
    if (!value) {
      stopTilt();
      revision++;
      canvas.hidden = true;
      poster.hidden = false;
      status.textContent = '';
    }
  }

  async function fetchImage(url) {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  }

  async function activate() {
    const current = ++revision;
    canvas.hidden = true;
    poster.hidden = false;
    status.textContent = 'Loading depth…';
    try {
      renderer ||= makeRenderer();
      const images = await Promise.all([fetchImage(scene.image), fetchImage(scene.depth)]);
      if (current !== revision) return;
      renderer.load(images);
      canvas.hidden = false;
      poster.hidden = true;
      status.textContent = tiltActive ? 'Tilt your phone to move the image.' :
        reduced.matches ? 'Use the view angle slider to explore the depth.' : 'Move or drag across the image.';
      draw();
    } catch {
      if (current !== revision) return;
      setActive(false);
      status.textContent = 'Interactive depth is unavailable. The still image is shown.';
    }
  }

  function choose(next) {
    scene = next;
    gallery.querySelector('h2').textContent = scene.title;
    gallery.querySelector('[data-depth-count]').textContent = `${scenes.indexOf(scene) + 1} / ${scenes.length}`;
    neutral = undefined;
    stage.style.setProperty('--depth-ratio', String(scene.width / scene.height));
    poster.alt = scene.alt;
    poster.src = flat.href = scene.image;
    slider.value = '0';
    x = y = 0;
    for (const link of links) {
      if (link.dataset.depthId === scene.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    if (active) activate();
  }

  function goTo(next) {
    choose(next);
    const url = new URL(location.href);
    url.searchParams.set('view', scene.id);
    history.replaceState(null, '', url);
  }

  async function closeFullscreen() {
    if (document.fullscreenElement === gallery) await document.exitFullscreen().catch(() => {});
    if (dialog.open) dialog.close();
  }

  controls.hidden = route.hidden = false;
  tilt.hidden = !canTilt();
  fullscreen.hidden = typeof dialog.showModal !== 'function';
  fullscreen.addEventListener('click', () => {
    const request = ++fullscreenRequest;
    dialog.append(gallery);
    dialog.showModal();
    document.documentElement.classList.add('pano-open');
    fullscreen.hidden = true;
    exit.hidden = false;
    exit.focus();
    if (document.fullscreenEnabled && gallery.requestFullscreen) {
      gallery.requestFullscreen().then(() => {
        if (request !== fullscreenRequest || !dialog.open) {
          if (document.fullscreenElement === gallery) document.exitFullscreen().catch(() => {});
          return;
        }
        nativeFullscreen = document.fullscreenElement === gallery;
      }).catch(() => {});
    }
    if (!active) {
      setActive(true);
      activate();
    }
    draw();
  });
  exit.addEventListener('click', closeFullscreen);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeFullscreen();
  });
  dialog.addEventListener('close', () => {
    fullscreenRequest++;
    nativeFullscreen = false;
    origin.after(gallery);
    document.documentElement.classList.remove('pano-open');
    exit.hidden = true;
    fullscreen.hidden = false;
    fullscreen.focus({ preventScroll: true });
    draw();
  });
  document.addEventListener('fullscreenchange', () => {
    if (nativeFullscreen && document.fullscreenElement !== gallery) closeFullscreen();
  });
  route.addEventListener('click', event => {
    const direction = Number(event.target.closest('[data-depth-step]')?.dataset.depthStep);
    if (direction) goTo(scenes[(scenes.indexOf(scene) + direction + scenes.length) % scenes.length]);
  });
  tilt.addEventListener('click', () => {
    if (!tiltActive) {
      enableTilt();
      return;
    }
    stopTilt();
    status.textContent = 'Move or drag across the image.';
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stopTilt();
      x = Number(slider.value) / 100;
      y = 0;
      draw();
    }
    tilt.hidden = !canTilt();
    if (active) status.textContent = reduced.matches ? 'Use the view angle slider to explore the depth.' : 'Move or drag across the image.';
  });
  const id = new URLSearchParams(location.search).get('view');
  choose(scenes.find(item => item.id === id) ?? scenes[0]);
  button.addEventListener('click', () => {
    autoStart = false;
    setActive(!active);
    if (active) activate();
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goTo(scenes.find(item => item.id === link.dataset.depthId));
    gallery.scrollIntoView({ block: 'start' });
  }));
  slider.addEventListener('input', () => {
    if (tiltActive) {
      stopTilt();
      status.textContent = 'Use the slider or move across the image.';
    }
    x = Number(slider.value) / 100;
    y = 0;
    draw();
  });
  stage.addEventListener('pointermove', event => {
    if (autoStart && !active && !reduced.matches && event.pointerType === 'mouse') {
      autoStart = false;
      setActive(true);
      activate();
    }
    if (!active || tiltActive || reduced.matches || (event.pointerType === 'touch' && !stage.hasPointerCapture(event.pointerId))) return;
    const rect = stage.getBoundingClientRect();
    x = clamp((event.clientX - rect.left) * 2 / rect.width - 1, -1, 1);
    y = clamp((event.clientY - rect.top) * 2 / rect.height - 1, -1, 1);
    draw();
  });
  stage.addEventListener('pointerdown', event => {
    if (active && !reduced.matches && event.pointerType === 'touch') {
      if (tiltActive) {
        stopTilt();
        status.textContent = 'Move or drag across the image.';
      }
      stage.setPointerCapture(event.pointerId);
    }
  });
  canvas.addEventListener('webglcontextlost', () => {
    setActive(false);
    renderer = undefined;
    status.textContent = 'The depth viewer closed. The still image is shown.';
  });
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(stage);
})();
