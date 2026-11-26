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
  const controls = gallery.querySelector('.depth-controls');
  const links = [...document.querySelectorAll('[data-depth-id]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let scene;
  let active = false;
  let revision = 0;
  let renderer;
  let frame = 0;
  let x = 0;
  let y = 0;

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
      status.textContent = reduced.matches ? 'Use the view angle slider to explore the depth.' : 'Move or drag across the image.';
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

  controls.hidden = false;
  const id = new URLSearchParams(location.search).get('view');
  choose(scenes.find(item => item.id === id) ?? scenes[0]);
  button.addEventListener('click', () => {
    setActive(!active);
    if (active) activate();
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    choose(scenes.find(item => item.id === link.dataset.depthId));
    const url = new URL(location.href);
    url.searchParams.set('view', scene.id);
    history.replaceState(null, '', url);
    gallery.scrollIntoView({ block: 'start' });
  }));
  slider.addEventListener('input', () => {
    x = Number(slider.value) / 100;
    y = 0;
    draw();
  });
  stage.addEventListener('pointermove', event => {
    if (!active || reduced.matches || (event.pointerType === 'touch' && !stage.hasPointerCapture(event.pointerId))) return;
    const rect = stage.getBoundingClientRect();
    x = clamp((event.clientX - rect.left) * 2 / rect.width - 1, -1, 1);
    y = clamp((event.clientY - rect.top) * 2 / rect.height - 1, -1, 1);
    draw();
  });
  stage.addEventListener('pointerdown', event => {
    if (active && !reduced.matches && event.pointerType === 'touch') stage.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('webglcontextlost', () => {
    setActive(false);
    renderer = undefined;
    status.textContent = 'The depth viewer closed. The still image is shown.';
  });
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(stage);
})();
