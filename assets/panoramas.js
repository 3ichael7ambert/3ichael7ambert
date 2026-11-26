(() => {
  const data = document.querySelector('#panorama-data');
  if (!data) return;
  const scenes = JSON.parse(data.textContent);
  const viewer = document.querySelector('.pano');
  const canvas = viewer.querySelector('canvas');
  const poster = viewer.querySelector('[data-pano-poster]');
  const open = viewer.querySelector('[data-pano-open]');
  const status = viewer.querySelector('[data-pano-status]');
  const controls = viewer.querySelector('.pano-controls');
  const help = viewer.querySelector('[data-pano-help]');
  const heading = viewer.querySelector('h2');
  const flat = viewer.querySelector('[data-pano-flat]');
  const links = [...document.querySelectorAll('[data-scene]')];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let current = scenes[0];
  let renderer;
  let loading = 0;
  let yaw = 0;
  let pitch = 0;
  let zoom = 1;
  let drag;
  let frame;

  function makeRenderer() {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) throw new Error('WebGL is unavailable');
    const program = gl.createProgram();
    const vertex = `
      attribute vec2 point;
      varying vec2 screenPoint;
      void main() {
        screenPoint = point;
        gl_Position = vec4(point, 0.0, 1.0);
      }
    `;
    const fragment = `
      precision mediump float;
      varying vec2 screenPoint;
      uniform sampler2D panorama;
      uniform vec3 view;
      uniform float aspect;
      void main() {
        vec3 ray = normalize(vec3(screenPoint.x * aspect, screenPoint.y, view.z));
        float c = cos(view.y);
        float s = sin(view.y);
        ray = vec3(ray.x, ray.y * c + ray.z * s, ray.z * c - ray.y * s);
        float longitude = atan(ray.x, ray.z) + view.x;
        vec2 uv = vec2(fract(longitude / 6.28318531 + 0.5), 0.5 - asin(clamp(ray.y, -1.0, 1.0)) / 3.14159265);
        gl_FragColor = texture2D(panorama, uv);
      }
    `;
    for (const [type, code] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Panorama shader unavailable');
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Panorama renderer unavailable');
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const point = gl.getAttribLocation(program, 'point');
    gl.enableVertexAttribArray(point);
    gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const view = gl.getUniformLocation(program, 'view');
    const aspect = gl.getUniformLocation(program, 'aspect');
    return {
      upload(image) {
        const limit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        let source = image;
        if (image.width > limit) {
          source = document.createElement('canvas');
          source.width = limit;
          source.height = limit / 2;
          source.getContext('2d').drawImage(image, 0, 0, source.width, source.height);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        if (gl.getError() !== gl.NO_ERROR) throw new Error('Could not load panorama texture');
      },
      draw() {
        const ratio = Math.min(devicePixelRatio || 1, 1.5);
        const width = Math.round(canvas.clientWidth * ratio);
        const height = Math.round(canvas.clientHeight * ratio);
        if (!width || !height) return;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform3f(view, yaw, pitch, zoom);
        gl.uniform1f(aspect, width / height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
  }

  function draw() {
    if (canvas.hidden || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      renderer?.draw();
    });
  }

  function choose(scene) {
    current = scene;
    heading.textContent = scene.title;
    flat.href = scene.image;
    poster.src = scene.thumb;
    poster.alt = scene.title;
    links.forEach(link => {
      if (link.dataset.scene === scene.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function fallback(message) {
    loading++;
    renderer = undefined;
    canvas.hidden = true;
    poster.hidden = false;
    controls.hidden = true;
    help.hidden = true;
    open.hidden = true;
    status.textContent = message;
  }

  async function show() {
    const sequence = ++loading;
    const image = new Image();
    status.textContent = 'Loading panorama…';
    canvas.hidden = true;
    poster.hidden = false;
    try {
      renderer ||= makeRenderer();
      image.src = current.image;
      await image.decode();
      if (loading !== sequence) return;
      renderer.upload(image);
      yaw = pitch = 0;
      zoom = 1;
      poster.hidden = open.hidden = true;
      canvas.hidden = controls.hidden = help.hidden = false;
      status.textContent = '';
      canvas.focus({ preventScroll: true });
      draw();
    } catch {
      if (loading === sequence) fallback('Interactive view is unavailable. Open the flat image to see the photograph.');
    }
  }

  function adjust(action) {
    if (action === 'left') yaw -= .24;
    if (action === 'right') yaw += .24;
    if (action === 'up') pitch += .18;
    if (action === 'down') pitch -= .18;
    pitch = clamp(pitch, -1.45, 1.45);
    if (action === 'in') zoom = clamp(zoom * 1.25, .8, 3);
    if (action === 'out') zoom = clamp(zoom / 1.25, .8, 3);
    if (action === 'reset') { yaw = pitch = 0; zoom = 1; }
    draw();
  }

  const requested = scenes.find(scene => scene.id === new URLSearchParams(location.search).get('view'));
  choose(requested || scenes[0]);
  open.hidden = false;
  open.addEventListener('click', show);
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const scene = scenes.find(item => item.id === link.dataset.scene);
    choose(scene);
    const address = new URL(location.href);
    address.searchParams.set('view', scene.id);
    history.replaceState(null, '', address);
    if (renderer) show();
    viewer.scrollIntoView({ block: 'nearest' });
  }));
  controls.addEventListener('click', event => adjust(event.target.dataset.view));
  canvas.addEventListener('keydown', event => {
    const action = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      '+': 'in', '-': 'out', Home: 'reset' }[event.key];
    if (!action) return;
    event.preventDefault();
    adjust(action);
  });
  canvas.addEventListener('pointerdown', event => {
    if (drag || event.button !== 0) return;
    canvas.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  canvas.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    yaw -= (event.clientX - drag.x) * .007 / zoom;
    pitch = clamp(pitch + (event.clientY - drag.y) * .007 / zoom, -1.45, 1.45);
    drag.x = event.clientX;
    drag.y = event.clientY;
    draw();
  });
  canvas.addEventListener('lostpointercapture', () => { drag = undefined; });
  canvas.addEventListener('webglcontextlost', () => fallback('The interactive view closed. You can still open the flat image.'));
  new ResizeObserver(draw).observe(canvas);
})();
