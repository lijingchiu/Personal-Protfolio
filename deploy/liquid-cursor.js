/**
 * Liquid Cursor — whole-page DOM distortion
 *
 * Algorithm: Jos Stam "Stable Fluids" (CPU 2D, 64×64 grid)
 *   → exports velocity/dye field to a 2D canvas
 *   → drives SVG feDisplacementMap applied to <nav> + <main>
 *
 * This is intentionally different from the WebGL image-distortion approach
 * (jENEMjN) — here the fluid field displaces real DOM elements via CSS filter.
 */
(function initLiquidCursor() {
  'use strict';

  // ── Grid config ────────────────────────────────────────────────────────────
  const N    = 64;   // grid cells (64×64)
  const ITER = 6;    // Gauss-Seidel pressure iterations
  const DT   = 0.14;

  const SZ = (N + 2) * (N + 2);
  let vx  = new Float32Array(SZ), vy  = new Float32Array(SZ);
  let vx0 = new Float32Array(SZ), vy0 = new Float32Array(SZ);
  // Dye channels: dr → R → horizontal displacement
  //               dg → G → vertical   displacement
  let dr  = new Float32Array(SZ), dg  = new Float32Array(SZ);
  let dr0 = new Float32Array(SZ), dg0 = new Float32Array(SZ);

  const IX = (x, y) => x + (N + 2) * y;

  // ── Boundary conditions ────────────────────────────────────────────────────
  function setBnd(b, x) {
    for (let i = 1; i <= N; i++) {
      x[IX(0,     i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
      x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)] : x[IX(N, i)];
      x[IX(i,     0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
      x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
    }
    x[IX(0,     0    )] = 0.5 * (x[IX(1, 0    )] + x[IX(0,     1)]);
    x[IX(0,     N + 1)] = 0.5 * (x[IX(1, N + 1)] + x[IX(0,     N)]);
    x[IX(N + 1, 0    )] = 0.5 * (x[IX(N, 0    )] + x[IX(N + 1, 1)]);
    x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)]);
  }

  // ── Gauss-Seidel linear solve ──────────────────────────────────────────────
  function linSolve(b, x, x0, a, c) {
    const inv = 1.0 / c;
    for (let k = 0; k < ITER; k++) {
      for (let j = 1; j <= N; j++) {
        for (let i = 1; i <= N; i++) {
          x[IX(i, j)] = (x0[IX(i, j)] + a * (
            x[IX(i - 1, j)] + x[IX(i + 1, j)] +
            x[IX(i, j - 1)] + x[IX(i, j + 1)]
          )) * inv;
        }
      }
      setBnd(b, x);
    }
  }

  // ── Bilinear advection ─────────────────────────────────────────────────────
  function advect(b, d, d0, u, v) {
    const dt0 = DT * N;
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        let px = i - dt0 * u[IX(i, j)];
        let py = j - dt0 * v[IX(i, j)];
        px = Math.max(0.5, Math.min(N + 0.5, px));
        py = Math.max(0.5, Math.min(N + 0.5, py));
        const i0 = px | 0, i1 = i0 + 1;
        const j0 = py | 0, j1 = j0 + 1;
        const s1 = px - i0, s0 = 1.0 - s1;
        const t1 = py - j0, t0 = 1.0 - t1;
        d[IX(i, j)] =
          s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
          s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
      }
    }
    setBnd(b, d);
  }

  // ── Pressure projection (Helmholtz decomposition) ─────────────────────────
  function project(u, v, p, div) {
    const h = 1.0 / N;
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        div[IX(i, j)] = -0.5 * h * (
          u[IX(i + 1, j)] - u[IX(i - 1, j)] +
          v[IX(i, j + 1)] - v[IX(i, j - 1)]
        );
        p[IX(i, j)] = 0;
      }
    }
    setBnd(0, div);
    setBnd(0, p);
    linSolve(0, p, div, 1, 4);
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        u[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) / h;
        v[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) / h;
      }
    }
    setBnd(1, u);
    setBnd(2, v);
  }

  // ── One simulation step ────────────────────────────────────────────────────
  function simStep() {
    // Decay
    for (let i = 0; i < SZ; i++) {
      vx[i] *= 0.977; vy[i] *= 0.977;
      dr[i] *= 0.968; dg[i] *= 0.968;
    }

    // Velocity: project → advect → project
    project(vx, vy, vx0, vy0);
    advect(1, vx0, vx, vx, vy);
    advect(2, vy0, vy, vx, vy);
    project(vx0, vy0, vx, vy);
    let t;
    t = vx; vx = vx0; vx0 = t;
    t = vy; vy = vy0; vy0 = t;

    // Dye: advect only (no diffuse — keeps sharp plumes)
    advect(0, dr0, dr, vx, vy);
    advect(0, dg0, dg, vx, vy);
    t = dr; dr = dr0; dr0 = t;
    t = dg; dg = dg0; dg0 = t;
  }

  // ── Gaussian splat at cursor ───────────────────────────────────────────────
  function addSplash(gx, gy, dvx, dvy) {
    const R   = 3;
    const spd = Math.sqrt(dvx * dvx + dvy * dvy);
    const str = Math.min(spd, 18);
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > R) continue;
        const w  = (1 - d / R) * (1 - d / R);
        const xi = (gx + dx + 0.5) | 0;
        const yi = (gy + dy + 0.5) | 0;
        if (xi < 1 || xi > N || yi < 1 || yi > N) continue;
        const idx = IX(xi, yi);
        vx[idx] += (dvx / (spd + 0.001)) * str * w * 14;
        vy[idx] += (dvy / (spd + 0.001)) * str * w * 14;
        dr[idx] += (dvx / (spd + 0.001)) * str * w * 7;
        dg[idx] += (dvy / (spd + 0.001)) * str * w * 7;
      }
    }
  }

  // ── Displacement canvas ────────────────────────────────────────────────────
  const dispCanvas     = document.createElement('canvas');
  dispCanvas.width     = N;
  dispCanvas.height    = N;
  const dctx           = dispCanvas.getContext('2d');
  const imgData        = dctx.createImageData(N, N);
  let   blobUrl        = '';

  function exportMap() {
    const d = imgData.data;

    // Dynamic range: normalise so quiet moments don't collapse
    let mx = 0.001;
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        const v = Math.abs(dr[IX(i, j)]) + Math.abs(dg[IX(i, j)]);
        if (v > mx) mx = v;
      }
    }
    const norm = Math.min(mx, 5.0);

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const fi = IX(i + 1, j + 1);
        const px = i + j * N;
        // Neutral = 128 (no displacement); above = positive, below = negative
        d[px * 4    ] = Math.max(0, Math.min(255, (dr[fi] / norm * 0.5 + 0.5) * 255 | 0));
        d[px * 4 + 1] = Math.max(0, Math.min(255, (dg[fi] / norm * 0.5 + 0.5) * 255 | 0));
        d[px * 4 + 2] = 128;
        d[px * 4 + 3] = 255;
      }
    }
    dctx.putImageData(imgData, 0, 0);

    dispCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      feImg.setAttribute('href', url);
      feImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      blobUrl = url;
    });
  }

  // ── SVG filter (feDisplacementMap) ─────────────────────────────────────────
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.assign(svgEl.style, {
    position: 'fixed', top: '0', left: '0',
    width: '0', height: '0', overflow: 'hidden', pointerEvents: 'none',
  });
  svgEl.innerHTML = [
    '<defs>',
    '  <filter id="lc-filter" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">',
    '    <feImage id="lc-feimg" result="dmap" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"/>',
    '    <feDisplacementMap id="lc-fedm" in="SourceGraphic" in2="dmap" scale="0" xChannelSelector="R" yChannelSelector="G"/>',
    '  </filter>',
    '</defs>',
  ].join('');
  document.body.appendChild(svgEl);

  const feImg  = svgEl.querySelector('#lc-feimg');
  const feDisp = svgEl.querySelector('#lc-fedm');

  // Apply to DOM layer only — skip #gl canvas (already WebGL)
  document.querySelectorAll('nav, main').forEach(el => {
    el.style.filter = 'url(#lc-filter)';
  });

  // ── Pointer tracking ───────────────────────────────────────────────────────
  let curX = window.innerWidth  * 0.5;
  let curY = window.innerHeight * 0.5;
  let targetScale  = 0;
  let currentScale = 0;
  let pending      = null;

  document.addEventListener('mousemove', e => {
    const dx = e.clientX - curX;
    const dy = e.clientY - curY;
    curX = e.clientX;
    curY = e.clientY;

    const spd = Math.sqrt(dx * dx + dy * dy);
    if (spd < 0.4) return;

    // Map screen coords → grid coords (1..N range)
    const gx = (curX / window.innerWidth)  * N + 1;
    const gy = (curY / window.innerHeight) * N + 1;
    pending      = { gx, gy, dvx: dx, dvy: dy };
    targetScale  = Math.min(32, spd * 2.8);
  });

  // Touch support
  document.addEventListener('touchmove', e => {
    const t  = e.touches[0];
    const dx = t.clientX - curX;
    const dy = t.clientY - curY;
    curX = t.clientX; curY = t.clientY;
    const spd = Math.sqrt(dx * dx + dy * dy);
    if (spd < 0.4) return;
    const gx = (curX / window.innerWidth)  * N + 1;
    const gy = (curY / window.innerHeight) * N + 1;
    pending     = { gx, gy, dvx: dx, dvy: dy };
    targetScale = Math.min(32, spd * 2.8);
  }, { passive: true });

  // ── Animation loop ─────────────────────────────────────────────────────────
  let frame = 0;
  function tick() {
    requestAnimationFrame(tick);

    if (pending) {
      addSplash(pending.gx, pending.gy, pending.dvx, pending.dvy);
      pending = null;
    }

    simStep();

    // Spring-damp scale
    currentScale += (targetScale - currentScale) * 0.055;
    targetScale  *= 0.88;
    feDisp.setAttribute('scale', currentScale.toFixed(2));

    // Export displacement map every 2nd frame (~30fps)
    frame++;
    if (frame % 2 === 0) exportMap();
  }

  tick();
})();
