(() => {
  'use strict';
  const desk = document.querySelector('#drawing-desk');
  const ink = document.querySelector('#desk-ink');
  const pencil = document.querySelector('#pencil-cursor');
  const toolbar = document.querySelector('#desk-tools');
  const pencilSetting = document.querySelector('#pencil-setting');
  const keyPoint = document.querySelector('#desk-key-point');
  const objects = [...desk.querySelectorAll('[data-object]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const papers = new Map();
  let paper = 'introduction';
  let tool = 'browse';
  let gesture;
  let keyboardStroke;
  let point;
  let angle;
  let position;

  function showPencil(x, y, pointerType, drawing) {
    const visible = (pointerType === 'mouse' && (drawing || pencilSetting.checked && tool === 'browse')) ||
      (pointerType !== 'mouse' && drawing);
    pencil.hidden = !visible || !!document.querySelector('dialog[open]');
    if (pencil.hidden) {
      angle = undefined;
      return;
    }
    const target = Math.atan2(innerHeight / 2 - y, innerWidth / 2 - x) * 180 / Math.PI - 45;
    angle = angle === undefined ? target : angle + ((target - angle + 540) % 360 - 180);
    pencil.style.transform = `translate3d(${x}px,${y}px,0) rotate(${reduced.matches || !window.portfolioAppearance?.motion ? 0 : angle}deg)`;
  }

  function endGesture() {
    const old = gesture;
    gesture = null;
    if (old && desk.hasPointerCapture(old.id)) desk.releasePointerCapture(old.id);
    keyboardStroke = null;
  }
  function setTool(value, focus = true) {
    endGesture();
    tool = value;
    desk.dataset.tool = value;
    desk.tabIndex = ['pencil','eraser'].includes(value) ? 0 : -1;
    for (const button of toolbar.querySelectorAll('[data-tool]')) {
      button.setAttribute('aria-pressed', String(button.dataset.tool === value));
    }
    if (focus && desk.tabIndex === 0) desk.focus({preventScroll:true});
    keyPoint.hidden = true;
    pencil.hidden = true;
  }

  function move(object, x, y) {
    const left = Math.min(Math.max(0, x), Math.max(0, innerWidth - object.offsetWidth));
    const top = Math.min(Math.max(0, y), Math.max(0, innerHeight - object.offsetHeight));
    object.style.left = left + 'px';
    object.style.top = top + 'px';
    object.dataset.placed = '';
    if (object.classList.contains('desk-ticket') && left < innerWidth / 4 && !toolbar.querySelector('.desk-discovery')) {
      const link = document.createElement('a');
      link.className = 'desk-discovery';
      link.href = 'https://github.com/3ichael7ambert/divinity-js';
      link.textContent = 'Found · Divinity archive';
      toolbar.append(link);
    }
  }
  function startStroke(x, y) {
    const stroke = document.createElementNS('http://www.w3.org/2000/svg','path');
    stroke.setAttribute('d', `M ${x} ${y} l .1 0`);
    ink.append(stroke);
    return stroke;
  }
  function draw(stroke, x, y) {
    stroke.setAttribute('d', stroke.getAttribute('d') + ` L ${Math.round(x)} ${Math.round(y)}`);
  }
  function erase(x, y) {
    document.elementsFromPoint(x, y).filter(node => node.parentNode === ink).forEach(node => node.remove());
  }

  toolbar.addEventListener('click', event => {
    const value = event.target.closest('[data-tool]')?.dataset.tool;
    if (value) setTool(value);
  });
  document.addEventListener('sketchbook:page', event => {
    if (event.detail === paper) return;
    papers.set(paper, { strokes:[...ink.children], objects:objects.map(object => [object.style.left,object.style.top]) });
    paper = event.detail;
    const saved = papers.get(paper);
    ink.replaceChildren(...(saved?.strokes || []));
    objects.forEach((object, index) => {
      const [left,top] = saved?.objects[index] || ['', ''];
      object.style.left = left;
      object.style.top = top;
      object.toggleAttribute('data-placed', !!left);
    });
    setTool('browse',false);
  });
  pencilSetting.addEventListener('change', () => {
    if (position) showPencil(position.x,position.y,position.type,false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || tool === 'browse') return;
    setTool('browse');
    toolbar.querySelector('[data-tool=browse]').focus();
  });

  desk.addEventListener('pointerdown', event => {
    if (tool === 'browse' || gesture || event.button !== 0) return;
    const object = event.target.closest('[data-object]');
    if (tool === 'clip' && !object) return;
    event.preventDefault();
    desk.setPointerCapture(event.pointerId);
    gesture = {id:event.pointerId,object};
    const {clientX:x,clientY:y} = event;
    if (tool === 'clip') {
      const bounds = object.getBoundingClientRect();
      gesture.dx = x - bounds.left;
      gesture.dy = y - bounds.top;
    }
    if (tool === 'pencil') gesture.stroke = startStroke(x,y);
    if (tool === 'eraser') erase(x,y);
    showPencil(x,y,event.pointerType,tool === 'pencil');
  });
  document.addEventListener('pointermove', event => {
    const {clientX:x,clientY:y,pointerType:type} = event;
    position = {x,y,type};
    const drawing = tool === 'pencil' && (type === 'mouse' || gesture?.id === event.pointerId);
    showPencil(x,y,type,drawing);
    if (gesture?.id !== event.pointerId) return;
    if (tool === 'clip') move(gesture.object,x - gesture.dx,y - gesture.dy);
    if (tool === 'eraser') erase(x,y);
    if (tool === 'pencil') draw(gesture.stroke,x,y);
  },{passive:true});
  desk.addEventListener('pointerup', event => {
    if (gesture?.id !== event.pointerId) return;
    if (tool === 'clip') move(gesture.object,event.clientX - gesture.dx,event.clientY - gesture.dy);
    endGesture();
    if (event.pointerType !== 'mouse') pencil.hidden = true;
  });
  desk.addEventListener('lostpointercapture', () => { gesture = null; });
  desk.addEventListener('pointercancel', () => { endGesture(); pencil.hidden = true; });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) pencil.hidden = true;
  });

  const steps = {ArrowUp:[0,-8],ArrowDown:[0,8],ArrowLeft:[-8,0],ArrowRight:[8,0]};
  desk.addEventListener('keydown', event => {
    const step = steps[event.key];
    const object = event.target.closest('[data-object]');
    if (object && tool === 'clip' && step) {
      event.preventDefault();
      move(object,object.offsetLeft + step[0],object.offsetTop + step[1]);
      return;
    }
    if (event.target !== desk || !['pencil','eraser'].includes(tool) || (!step && event.code !== 'Space')) return;
    event.preventDefault();
    point ||= {x:innerWidth / 2,y:innerHeight / 2};
    if (step) {
      point.x = Math.max(0,Math.min(innerWidth - 1,point.x + step[0]));
      point.y = Math.max(0,Math.min(innerHeight - 1,point.y + step[1]));
    }
    keyPoint.style.transform = `translate(${point.x}px,${point.y}px)`;
    keyPoint.hidden = false;
    if (tool === 'pencil' && event.code === 'Space' && !event.repeat) keyboardStroke = startStroke(point.x,point.y);
    if (tool === 'pencil' && step && keyboardStroke) draw(keyboardStroke,point.x,point.y);
    if (tool === 'eraser' && event.code === 'Space') erase(point.x,point.y);
  });
  desk.addEventListener('keyup', event => { if (event.code === 'Space') keyboardStroke = null; });
  desk.addEventListener('focusout', () => { keyboardStroke = null; keyPoint.hidden = true; });
  for (const object of objects) {
    object.style.setProperty('--x', Number(object.dataset.x) * 100 + '%');
    object.style.setProperty('--y', Number(object.dataset.y) * 100 + '%');
  }
  setTool('browse',false);
})();
