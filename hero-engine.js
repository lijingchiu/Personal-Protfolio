// ════════════════════════════════════════════════════════════
// hero-engine.js — Three.js WebGL layer (ES module)
//  · Glossy crystal/gem objects with physics hover-to-repel
//  · Particle tunnel for the immersive scroll zone
//  · setTheme(t 0..1) light↔cinematic-dark  ·  setScroll(p)
//  Decoupled from DOM. Driven by gsap.ticker (set up in app.js).
// ════════════════════════════════════════════════════════════
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('gl');
const isMobile = window.matchMedia('(max-width: 720px)').matches;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({
  canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const COL_LIGHT = new THREE.Color('#f7f8f2');
const COL_DARK  = new THREE.Color('#0e0f14');
scene.background = null; // canvas alpha; DOM body provides base colour
scene.fog = new THREE.Fog(COL_LIGHT.clone(), 14, 34);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0, 13);

// Studio reflections via RoomEnvironment (no external HDR fetch)
const pmrem = new THREE.PMREMGenerator(renderer);
const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
scene.environment = envRT.texture;

// Lights (env carries most; these add directional sparkle)
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(5, 8, 8);
scene.add(key);
const rim = new THREE.DirectionalLight(0x3d82ff, 1.2);
rim.position.set(-6, -3, 4);
scene.add(rim);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// ─────────────────────────────────────────────
// CRYSTALS — glossy gems (white / black / blue / glass)
// ─────────────────────────────────────────────
const matWhite = new THREE.MeshPhysicalMaterial({ color: '#f5f9f0', metalness: 0.0, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03, reflectivity: 0.8, envMapIntensity: 1.3 });
const matBlack = new THREE.MeshPhysicalMaterial({ color: '#181c28', metalness: 0.15, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.5 });
const matBlue  = new THREE.MeshPhysicalMaterial({ color: '#7c6ee0', metalness: 0.05, roughness: 0.10, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 });
const matGlass = new THREE.MeshPhysicalMaterial({ color: '#c8f0d8', metalness: 0, roughness: 0.02, transmission: isMobile ? 0 : 0.95, thickness: 1.4, ior: 1.48, clearcoat: 1, envMapIntensity: 1.8 });
const matGold  = new THREE.MeshPhysicalMaterial({ color: '#d6e87a', metalness: 0.3, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.4 });

function gem(r) {
  // faceted gem: low-detail icosa with flat shading
  const g = new THREE.IcosahedronGeometry(r, 0);
  g.computeVertexNormals();
  return g;
}
// a "cross joint" / plus shape from merged boxes (the 卡榫 reference)
function joint(s) {
  const grp = new THREE.Group();
  const m = matWhite;
  const a = new THREE.BoxGeometry(s * 3, s, s);
  const b = new THREE.BoxGeometry(s, s * 3, s);
  const c = new THREE.BoxGeometry(s, s, s * 3);
  [a, b, c].forEach(geo => grp.add(new THREE.Mesh(geo, m)));
  return grp;
}

const SPECS = isMobile ? [
  { type: 'gem',   mat: matBlue,  r: 1.5, pos: [-3.4,  1.6, 0] },
  { type: 'gem',   mat: matWhite, r: 1.2, pos: [ 3.2, -1.4,-1] },
  { type: 'joint', mat: matGold,  r: 0.5, pos: [ 2.6,  2.2, 0] },
] : [
  { type: 'gem',   mat: matBlue,  r: 1.7,  pos: [-4.6,  1.4, 0.5] },
  { type: 'gem',   mat: matWhite, r: 1.25, pos: [ 4.4,  2.0,-1.2] },
  { type: 'gem',   mat: matBlack, r: 1.5,  pos: [ 3.0, -2.0, 0.8] },
  { type: 'glass', mat: matGlass, r: 1.35, pos: [-3.2, -1.8, 1.4] },
  { type: 'joint', mat: matGold,  r: 0.55, pos: [ 0.4,  2.6,-0.6] },
  { type: 'gem',   mat: matBlue,  r: 0.9,  pos: [ 5.6, -1.0, 0  ] },
  { type: 'joint', mat: matWhite, r: 0.45, pos: [-5.4, -0.6, 0.4] },
];

const crystals = [];
const group = new THREE.Group();
scene.add(group);

SPECS.forEach((s, i) => {
  let mesh;
  if (s.type === 'joint') { mesh = joint(s.r); mesh.children.forEach(c => c.material = s.mat); }
  else { mesh = new THREE.Mesh(gem(s.r), s.mat); }
  const home = new THREE.Vector3(...s.pos);
  mesh.position.copy(home);
  mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
  group.add(mesh);
  crystals.push({
    mesh, home,
    pos: home.clone(),
    vel: new THREE.Vector3(),
    rotVel: new THREE.Vector3((Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004),
    floatPhase: Math.random() * 6.28,
    floatAmp: 0.18 + Math.random() * 0.22,
    radius: s.r,
  });
});

// ─────────────────────────────────────────────
// METEOR TUNNEL (immersive zone) — indigo→magenta streaks w/ trails
//  LineSegments = one draw call; head bright, tail fades to black (additive)
// ─────────────────────────────────────────────
let tunnel = null, tunnelMat = null;
let tunnelPos = null, tunnelHeadZ = null, tunnelXY = null, tunnelTrail = null;
const TCOUNT = isMobile ? 600 : 2200;
const TDEPTH = 90;
if (!reduce) {
  const verts = new Float32Array(TCOUNT * 2 * 3); // 2 vertices (head, tail) per meteor
  const cols  = new Float32Array(TCOUNT * 2 * 3);
  tunnelHeadZ = new Float32Array(TCOUNT);
  tunnelXY    = new Float32Array(TCOUNT * 2);
  tunnelTrail = new Float32Array(TCOUNT);
  const RAD = 9;
  const cIndigo = new THREE.Color(0x5a78d8); // 靛藍
  const cMag    = new THREE.Color(0xc24a92); // 洋紅
  for (let i = 0; i < TCOUNT; i++) {
    const a = Math.random() * 6.283;
    const rr = 2.4 + Math.random() * RAD;
    tunnelXY[i * 2]     = Math.cos(a) * rr;
    tunnelXY[i * 2 + 1] = Math.sin(a) * rr;
    tunnelHeadZ[i]      = -Math.random() * TDEPTH;
    tunnelTrail[i]      = 1.0 + Math.random() * 2.8; // meteor tail length
    const col = cIndigo.clone().lerp(cMag, Math.random()); // hue along gradient
    // head vertex — bright
    cols[i * 6 + 0] = col.r; cols[i * 6 + 1] = col.g; cols[i * 6 + 2] = col.b;
    // tail vertex — fade to near-black so additive blend dissolves the tail
    cols[i * 6 + 3] = col.r * 0.04; cols[i * 6 + 4] = col.g * 0.04; cols[i * 6 + 5] = col.b * 0.04;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  tunnelPos = verts;
  tunnelMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  tunnel = new THREE.LineSegments(geo, tunnelMat);
  tunnel.position.z = 0;
  scene.add(tunnel);
}

// ─────────────────────────────────────────────
// MOUSE → world point on z=0 plane (with damping)
// ─────────────────────────────────────────────
const ndc = new THREE.Vector2(-2, -2);
const targetNdc = new THREE.Vector2(-2, -2);
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const mouseWorld = new THREE.Vector3(999, 999, 0);
let mouseActive = false;

window.addEventListener('pointermove', e => {
  targetNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
  targetNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouseActive = true;
}, { passive: true });
window.addEventListener('pointerleave', () => { mouseActive = false; });

// ─────────────────────────────────────────────
// THEME + SCROLL state (lerped)
// ─────────────────────────────────────────────
let themeT = 0;        // 0 light, 1 dark  (target)
let themeCur = 0;      // smoothed
let scrollP = 0;       // 0..1 overall page progress (target)
let scrollCur = 0;     // smoothed
let zoneP = 0;         // 0..1 within immersive zone (target)
let zoneCur = 0;

const REPEL_R = 4.2;
const REPEL_K = 0.085;     // repulsion strength
const SPRING = 0.022;      // pull home
const DAMP = 0.86;         // velocity damping

let t = 0;
function frame(dtMs) {
  const dt = Math.min(dtMs || 16, 40) / 16;
  t += 0.016 * dt;

  // smooth state
  themeCur += (themeT - themeCur) * 0.06;
  scrollCur += (scrollP - scrollCur) * 0.08;
  zoneCur += (zoneP - zoneCur) * 0.08;

  // ndc damping for buttery mouse
  ndc.x += (targetNdc.x - ndc.x) * 0.18;
  ndc.y += (targetNdc.y - ndc.y) * 0.18;
  if (mouseActive) {
    raycaster.setFromCamera(ndc, camera);
    raycaster.ray.intersectPlane(plane, mouseWorld);
  }

  // crystal physics
  for (const c of crystals) {
    // idle float around home
    const fy = Math.sin(t * 0.7 + c.floatPhase) * c.floatAmp * 0.04;
    const homeY = c.home.y + Math.sin(t * 0.5 + c.floatPhase) * c.floatAmp;
    const target = c.home.clone(); target.y = homeY;

    // spring toward (floating) home
    const spring = target.clone().sub(c.pos).multiplyScalar(SPRING);
    c.vel.add(spring);

    // repulsion from mouse
    if (mouseActive) {
      const away = c.pos.clone().sub(mouseWorld);
      away.z *= 0.4;
      const d = away.length();
      if (d < REPEL_R && d > 0.001) {
        const f = (1 - d / REPEL_R);
        away.normalize().multiplyScalar(REPEL_K * f * f);
        c.vel.add(away);
      }
    }

    c.vel.multiplyScalar(DAMP);
    c.pos.add(c.vel);
    c.mesh.position.copy(c.pos);

    // rotation: idle + spin-up by velocity
    const speed = c.vel.length();
    c.mesh.rotation.x += c.rotVel.x + speed * 0.08;
    c.mesh.rotation.y += c.rotVel.y + speed * 0.10;
    c.mesh.rotation.z += c.rotVel.z;
  }

  // theme: fog colour + exposure + crystal fade as we leave hero
  const bg = COL_LIGHT.clone().lerp(COL_DARK, themeCur);
  scene.fog.color.copy(bg);
  renderer.toneMappingExposure = 1.05 - 0.15 * themeCur;
  rim.intensity = 1.2 + 0.8 * themeCur;
  rim.color.setHex(themeCur > 0.5 ? 0xa07ef5 : 0x3ab87a);

  // crystals recede & fade as immersive zone takes over
  const fade = 1 - zoneCur;
  group.position.z = -scrollCur * 6 - zoneCur * 10;
  group.scale.setScalar(0.6 + 0.4 * fade);
  [matWhite, matBlack, matBlue, matGlass, matGold].forEach(m => {
    m.transparent = true; m.opacity = Math.max(0.04, fade);
  });
  group.visible = fade > 0.03;

  // meteor tunnel: active in immersive zone
  if (tunnel) {
    tunnelMat.opacity = zoneCur * 0.95;
    tunnel.visible = zoneCur > 0.02;
    if (tunnel.visible) {
      const sp = (0.25 + zoneCur * 2.2) * dt;
      for (let i = 0; i < TCOUNT; i++) {
        let z = tunnelHeadZ[i] + sp;
        if (z > camera.position.z) z -= TDEPTH;
        tunnelHeadZ[i] = z;
        const x = tunnelXY[i * 2], y = tunnelXY[i * 2 + 1];
        // head vertex (leading, nearer camera)
        tunnelPos[i * 6 + 0] = x; tunnelPos[i * 6 + 1] = y; tunnelPos[i * 6 + 2] = z;
        // tail vertex (trailing, further away)
        tunnelPos[i * 6 + 3] = x; tunnelPos[i * 6 + 4] = y; tunnelPos[i * 6 + 5] = z - tunnelTrail[i];
      }
      tunnel.geometry.attributes.position.needsUpdate = true;
      tunnel.rotation.z += 0.0015 * dt + zoneCur * 0.004;
    }
  }

  // subtle parallax of whole group toward mouse
  if (mouseActive) {
    group.rotation.y += ((ndc.x * 0.18) - group.rotation.y) * 0.04;
    group.rotation.x += ((-ndc.y * 0.12) - group.rotation.x) * 0.04;
  }

  renderer.render(scene, camera);
}

// resize
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

// ─────────────────────────────────────────────
// Public API → consumed by app.js (ScrollTrigger)
// ─────────────────────────────────────────────
window.__hero = {
  ready: true,
  frame,                                   // called by gsap.ticker
  setTheme: v => { themeT = Math.max(0, Math.min(1, v)); },
  setScroll: v => { scrollP = Math.max(0, Math.min(1, v)); },
  setZone: v => { zoneP = Math.max(0, Math.min(1, v)); },
  isMobile, reduce,
};
window.dispatchEvent(new Event('hero-ready'));
