const game = document.querySelector('#sketch-run');
if (game) {
  const canvas = game.querySelector('canvas');
  const ink = canvas.getContext('2d');
  const toggle = game.querySelector('[data-play]');
  const status = game.querySelector('[role=status]');
  const width = canvas.width;
  const ground = 147;
  const stamps = [[161, 0], [325, 34], [499, 0], [660, 34]];
  const platforms = [[267, 368], [603, 699]];
  const keys = new Set();
  let x, y, velocity, collected, active, frame, last, onGround, clock;
  let controllerDirection = 0;
  let controllerJump = false;
  function reset() {
    x = 30;
    y = ground;
    velocity = 0;
    onGround = true;
    collected = new Set();
    clock = 0;
    draw();
  }
  function draw() {
    ink.clearRect(0, 0, canvas.width, canvas.height);
    const camera = Math.max(0, Math.min(width - canvas.width, x - canvas.width * 0.38));
    ink.save();
    ink.translate(-camera, 0);
    ink.lineWidth = 1;
    ink.strokeStyle = '#dfd6bd';
    for (let row = 16; row < canvas.height; row += 16) {
      ink.beginPath();
      ink.moveTo(0, row);
      ink.lineTo(width, row);
      ink.stroke();
    }
    ink.lineWidth = 2.5;
    ink.lineCap = 'round';
    ink.strokeStyle = '#303853';
    [[10, width - 12, ground], ...platforms.map(([a,b]) => [a,b,ground - 34])].forEach(([a,b,h]) => {
      ink.beginPath();
      ink.moveTo(a,h);
      ink.quadraticCurveTo((a+b)/2,h+3,b,h);
      ink.stroke();
    });
    ink.fillStyle = '#652f4f';
    ink.font = '18px Georgia';
    stamps.forEach(([position,height], i) => {
      if (!collected.has(i)) ink.fillText('✦', position - 8, ground - height - 14);
    });
    ink.fillText('Finish', width - 61, ground - 29);
    ink.beginPath();
    ink.arc(x, y - 30, 6, 0, Math.PI * 2);
    ink.moveTo(x, y - 24);
    ink.lineTo(x, y - 11);
    ink.moveTo(x - 9, y - 18);
    ink.lineTo(x + 9, y - 19);
    const stride = (keys.size || controllerDirection) && onGround ? Math.sin(clock * 0.026) * 5 : 0;
    ink.moveTo(x - 6 - stride, y);
    ink.lineTo(x, y - 11);
    ink.lineTo(x + 6 - stride, y);
    ink.stroke();
    ink.restore();
  }
  function stop(label = 'Paused') {
    active = false;
    cancelAnimationFrame(frame);
    keys.clear();
    controllerDirection = 0;
    controllerJump = false;
    toggle.textContent = collected.size === stamps.length && x >= width - 52 ? 'Play again' : 'Resume';
    status.textContent = label;
    draw();
  }
  function update(time) {
    const dt = Math.min(time - last, 32) / 1000;
    last = time;
    clock += dt * 1000;
    const pad = typeof navigator === 'undefined' ? null :
      Array.from(navigator.getGamepads?.() || []).find(item => item?.mapping === 'standard');
    const axis = pad?.axes[0] || 0;
    controllerDirection = pad?.buttons[14]?.pressed || axis < -.38 ? -1 :
      pad?.buttons[15]?.pressed || axis > .38 ? 1 : 0;
    const jump = !!pad?.buttons[0]?.pressed;
    if (jump && !controllerJump) press('jump');
    controllerJump = jump;
    const keyboardDirection = Number(keys.has('right')) - Number(keys.has('left'));
    x = Math.max(14, Math.min(width - 14, x + (keyboardDirection || controllerDirection) * 230 * dt));
    const previous = y;
    velocity += 620 * dt;
    y += velocity * dt;
    const ledge = ground - 34;
    const land = previous <= ledge && y >= ledge && platforms.some(([a,b]) => x >= a && x <= b) ? ledge : ground;
    onGround = velocity >= 0 && y >= land;
    if (onGround) {
      y = land;
      velocity = 0;
    }
    stamps.forEach(([position,height], i) => {
      if (!collected.has(i) && Math.abs(position - x) < 16 && Math.abs(y - (ground - height)) < 24) {
        collected.add(i);
        status.textContent = collected.size + ' of ' + stamps.length + ' ink stars';
      }
    });
    if (x >= width - 52 && collected.size === stamps.length) {
      stop('Page complete. All four ink stars collected.');
      return;
    }
    draw();
    frame = requestAnimationFrame(update);
  }
  function press(action) {
    if (!active) return;
    if (action === 'jump') {
      if (onGround) velocity = -275;
      return;
    }
    keys.add(action);
  }
  toggle.addEventListener('click', () => {
    if (active) {
      stop();
      return;
    }
    if (toggle.textContent === 'Play again') reset();
    active = true;
    toggle.textContent = 'Pause';
    status.textContent = collected.size + ' of ' + stamps.length + ' ink stars';
    canvas.focus({preventScroll:true});
    last = performance.now();
    frame = requestAnimationFrame(update);
  });
  const mapping = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'jump', ' ':'jump', a:'left', d:'right', w:'jump'};
  canvas.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') { stop(); return; }
    const action = mapping[event.key];
    if (!action) return;
    event.preventDefault();
    if (!event.repeat) press(action);
  });
  canvas.addEventListener('keyup', event => keys.delete(mapping[event.key]));
  canvas.addEventListener('blur', () => keys.clear());
  game.querySelectorAll('[data-move]').forEach(button => {
    const action = button.dataset.move;
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      press(action);
    });
    for (const name of ['pointerup','pointercancel','lostpointercapture']) {
      button.addEventListener(name, () => keys.delete(action));
    }
    button.addEventListener('keydown', event => {
      if (['Enter',' '].includes(event.key)) {
        event.preventDefault();
        if (!event.repeat) press(action);
      }
    });
    button.addEventListener('keyup', () => keys.delete(action));
    button.addEventListener('blur', () => keys.delete(action));
    button.addEventListener('click', event => {
      if (event.detail === 0 && action === 'jump') press(action);
    });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && active) stop(); });
  reset();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => {
      const visibleWidth = Math.max(280, Math.min(width, Math.round(canvas.clientWidth)));
      if (canvas.width !== visibleWidth) {
        canvas.width = visibleWidth;
        draw();
      }
    }).observe(canvas);
  }
  if (typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && active) stop();
    }).observe(canvas);
  }
}
