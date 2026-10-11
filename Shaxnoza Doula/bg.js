/* Interactive background: line-art baby bottles, pacifiers and smiling baby faces.
   They drift slowly, move away from the cursor and scatter on click/tap. */
(function () {
  const canvas = document.getElementById("bg");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COLORS = ["107, 31, 42", "46, 33, 27"]; // burgundy, espresso
  const TYPES = ["bottle", "pacifier", "baby"];

  /* Each icon is drawn in a 40×40 box centred on (0,0). */
  function drawBottle() {
    ctx.beginPath();
    ctx.moveTo(-3, -12); ctx.quadraticCurveTo(-3, -20, 0, -20); ctx.quadraticCurveTo(3, -20, 3, -12);
    ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-7, -12, 14, 5, 1.5); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-8, -7, 16, 27, 4); ctx.stroke();
    ctx.beginPath();
    for (const y of [0, 5, 10]) { ctx.moveTo(-8, y); ctx.lineTo(-4, y); }
    ctx.stroke();
  }
  function drawPacifier() {
    ctx.beginPath(); ctx.arc(0, -12, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3, 6); ctx.bezierCurveTo(-6, 17, 6, 17, 3, 6); ctx.stroke();
  }
  function drawBaby() {
    const arc = (x, y, r, a, b) => { ctx.beginPath(); ctx.arc(x, y, r, a, b); ctx.stroke(); };
    arc(0, 2, 14, 0, Math.PI * 2);                         // face
    arc(-14, 2, 3, Math.PI / 2, Math.PI * 1.5);            // ears
    arc(14, 2, 3, -Math.PI / 2, Math.PI / 2);
    ctx.beginPath();                                       // hair curl
    ctx.moveTo(0, -12); ctx.quadraticCurveTo(-3, -19, 2, -19); ctx.quadraticCurveTo(6, -18, 3, -14);
    ctx.stroke();
    arc(-5, 1, 2.4, Math.PI, Math.PI * 2);                 // happy closed eyes
    arc(5, 1, 2.4, Math.PI, Math.PI * 2);
    arc(0, 5, 5.5, Math.PI * 0.15, Math.PI * 0.85);        // smile
  }
  const DRAW = { bottle: drawBottle, pacifier: drawPacifier, baby: drawBaby };

  let w = 0, h = 0, dpr = 1, items = [];
  const mouse = { x: -9999, y: -9999 };
  const rand = (a, b) => a + Math.random() * (b - a);

  function make(i) {
    const size = rand(28, 50);
    return {
      type: TYPES[i % TYPES.length],
      x: rand(0, w), y: rand(0, h),
      dx: rand(-0.18, 0.18), dy: rand(-0.22, -0.05), // base drift (gently upwards)
      vx: 0, vy: 0,
      rot: rand(0, Math.PI * 2), vr: rand(-0.004, 0.004),
      size, color: COLORS[Math.random() < 0.6 ? 0 : 1], alpha: rand(0.12, 0.22)
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const count = Math.round(Math.min(34, Math.max(12, (w * h) / 42000)));
    while (items.length < count) items.push(make(items.length));
    items.length = count;
    if (reduced) draw();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const p of items) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const s = p.size / 40;
      ctx.scale(s, s);
      ctx.lineWidth = 1.4 / s;
      ctx.strokeStyle = `rgba(${p.color}, ${p.alpha})`;
      DRAW[p.type]();
      ctx.restore();
    }
  }

  function step() {
    for (const p of items) {
      // push away from the cursor
      const ddx = p.x - mouse.x, ddy = p.y - mouse.y;
      const dist = Math.hypot(ddx, ddy);
      if (dist < 140 && dist > 0.1) {
        const f = (1 - dist / 140) * 0.9;
        p.vx += (ddx / dist) * f; p.vy += (ddy / dist) * f;
        p.vr += (ddx > 0 ? 1 : -1) * 0.0015 * f;
      }
      p.vx *= 0.94; p.vy *= 0.94; p.vr *= 0.985;
      if (Math.abs(p.vr) < 0.002) p.vr += rand(-0.0004, 0.0004);
      p.x += p.dx + p.vx; p.y += p.dy + p.vy; p.rot += p.vr;

      const m = p.size;
      if (p.x < -m) p.x = w + m; else if (p.x > w + m) p.x = -m;
      if (p.y < -m) p.y = h + m; else if (p.y > h + m) p.y = -m;
    }
    draw();
    if (!document.hidden) requestAnimationFrame(step); else running = false;
  }

  function burst(x, y) {
    for (const p of items) {
      const ddx = p.x - x, ddy = p.y - y, dist = Math.hypot(ddx, ddy);
      if (dist < 240 && dist > 0.1) {
        const f = (1 - dist / 240) * 9;
        p.vx += (ddx / dist) * f; p.vy += (ddy / dist) * f;
        p.vr += rand(-0.06, 0.06);
      }
    }
  }

  window.addEventListener("resize", resize);
  resize();
  if (reduced) return;

  window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, dialog")) return;
    burst(e.clientX, e.clientY);
  });

  let running = true;
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !running) { running = true; requestAnimationFrame(step); }
  });
  requestAnimationFrame(step);
})();
