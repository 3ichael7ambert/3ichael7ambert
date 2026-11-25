'use strict';

const desk = document.getElementById('drawing-desk');
const ink = document.getElementById('desk-ink');
const cursor = document.getElementById('pencil-cursor');
const toolbar = document.getElementById('desk-tools');
const paperclip = document.getElementById('paperclip');
const pencilSetting = document.getElementById('pencil-setting');
const svgNS = 'http://www.w3.org/2000/svg';
let tool = 'browse';
let gesture;

function setTool(value) {
  if (gesture && desk.hasPointerCapture(gesture.id)) desk.releasePointerCapture(gesture.id);
  gesture = null;
  tool = value;
  desk.dataset.tool = value;
  for (const button of toolbar.querySelectorAll('[data-tool]')) {
    button.setAttribute('aria-pressed', String(button.dataset.tool === value));
  }
  cursor.hidden = true;
}

toolbar.addEventListener('click', event => {
  const value = event.target.closest('[data-tool]')?.dataset.tool;
  if (value) setTool(value);
});
pencilSetting.addEventListener('change', () => setTool(pencilSetting.checked ? 'pencil' : 'browse'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && tool !== 'browse') {
    setTool('browse');
    toolbar.querySelector('[data-tool=browse]').focus();
  }
});
document.addEventListener('pointermove', event => {
  const active = tool === 'pencil' && event.target === desk;
  const hovering = tool === 'browse' && pencilSetting.checked && event.pointerType !== 'touch';
  cursor.hidden = !(active || hovering) || document.querySelector('dialog[open]') !== null;
  if (!cursor.hidden) {
    cursor.style.transform = `translate3d(${event.clientX - 2}px,${event.clientY - cursor.offsetHeight + 4}px,0)`;
  }
}, { passive: true });
document.addEventListener('pointerout', event => {
  if (!event.relatedTarget) cursor.hidden = true;
});

function positionClip(x, y) {
  paperclip.dataset.placed = '';
  paperclip.style.left = Math.max(0, Math.min(desk.clientWidth - 48, x)) + 'px';
  paperclip.style.top = Math.max(0, Math.min(desk.clientHeight - 48, y)) + 'px';
}

function useTool(event) {
  const x = event.clientX;
  const y = event.clientY;
  if (tool === 'clip') {
    positionClip(x - gesture.offsetX, y - gesture.offsetY);
  } else if (tool === 'eraser') {
    for (const element of document.elementsFromPoint(x, y)) {
      if (element.parentNode === ink) element.remove();
    }
  } else if (tool === 'pencil') {
    const localX = Math.round(x);
    const localY = Math.round(y);
    gesture.path += ` L ${localX} ${localY}`;
    gesture.stroke.setAttribute('d', gesture.path);
  }
}

desk.addEventListener('pointerdown', event => {
  if (tool === 'browse' || gesture || event.button !== 0) return;
  if (tool === 'clip' && !paperclip.contains(event.target)) return;
  event.preventDefault();
  desk.setPointerCapture(event.pointerId);
  gesture = { id: event.pointerId };
  if (tool === 'clip') {
    const bounds = paperclip.getBoundingClientRect();
    gesture.offsetX = event.clientX - bounds.left;
    gesture.offsetY = event.clientY - bounds.top;
  }
  if (tool === 'pencil') {
    gesture.stroke = document.createElementNS(svgNS, 'path');
    gesture.path = `M ${Math.round(event.clientX)} ${Math.round(event.clientY)}`;
    ink.append(gesture.stroke);
  }
  useTool(event);
});
desk.addEventListener('pointermove', event => {
  if (gesture?.id === event.pointerId) useTool(event);
});
desk.addEventListener('lostpointercapture', () => { gesture = null; });
desk.addEventListener('pointerup', event => {
  if (gesture?.id === event.pointerId) useTool(event);
  if (event.pointerType === 'touch') cursor.hidden = true;
});
desk.addEventListener('pointercancel', () => { cursor.hidden = true; });
paperclip.addEventListener('keydown', event => {
  const offsets = { ArrowUp:[0,-12], ArrowDown:[0,12], ArrowLeft:[-12,0], ArrowRight:[12,0] };
  if (tool !== 'clip' || !offsets[event.key]) return;
  event.preventDefault();
  const [dx, dy] = offsets[event.key];
  positionClip(paperclip.offsetLeft + dx, paperclip.offsetTop + dy);
});
setTool('browse');
