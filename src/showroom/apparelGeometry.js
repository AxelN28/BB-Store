import { MathUtils, Vector3 } from 'three';
import { fullTurn, sample, surface, tube } from './shoeGeometry';

const cuts = {
  hoodie: { length: 1.61, width: 0.64, hem: 0.47, depth: 0.19, armhole: 0.64, cuffX: 1.01, cuffY: 0.01, cuff: 0.105 },
  tee: { length: 1.66, width: 0.61, hem: 0.59, depth: 0.135, armhole: 0.65, cuffX: 1.03, cuffY: 1.02, cuff: 0.18 },
  washed: { length: 1.72, width: 0.64, hem: 0.61, depth: 0.163, armhole: 0.62, cuffX: 1.10, cuffY: 0.91, cuff: 0.195 },
};
const neckEdge = 0.43;

function makeTorso(kind) {
  const cut = cuts[kind];
  return (x, u, face, lift = 0) => {
    const nearTop = MathUtils.smoothstep(u, 0.67, 1);
    const width = MathUtils.lerp(cut.hem, cut.width, MathUtils.smoothstep(u, 0, 0.24)) - 0.029 * nearTop;
    const outside = Math.abs(x);
    const shoulder = MathUtils.smoothstep(outside, neckEdge, 1) * 0.18;
    const scoop = (face === 1 ? 0.133 : 0.036) * (1 - MathUtils.smoothstep(outside, 0, neckEdge));
    const hemRipple = Math.cos(x * 13 + 0.2) * (kind === 'hoodie' ? 0.010 : 0.004) * (1 - u) ** 3;
    const y = cut.length * u - nearTop * (shoulder + scoop) + hemRipple;
    const fullness = 0.91 + Math.sin(u * Math.PI) * 0.16 - nearTop * 0.28;
    const verticalFolds = Math.cos(10.8 * x + u * 2.6) * 0.018 + Math.sin(21.1 * x - u * 4) * 0.010;
    const panel = cut.depth * fullness * (1 - 0.51 * outside ** 2);
    const z = face * (panel + lift + verticalFolds * (1 - nearTop * 0.82)) + x * 0.016;
    return new Vector3(x * width, y, z);
  };
}

function closedSeam(points, radius) {
  return tube(points.slice(0, -1), radius, true);
}

function addBody(add, torso, kind, cut) {
  const facePoint = (face, u, v, lift = 0) => torso(u * 2 - 1, v, face, lift);
  const hemHeight = kind === 'hoodie' ? 0.087 : 0.025;
  for (const face of [-1, 1]) {
    add('cloth', surface((u, v) => facePoint(face, u, v), 46, 53));
    add('trim', surface((u, v) => facePoint(face, u, v * hemHeight, 0.005), 45, 8));
    add('stitch', tube(sample((u) => facePoint(face, u, hemHeight + 0.005, 0.007), 45), 0.004));
  }

  for (const side of [-1, 1]) {
    add('cloth', surface((u, v) => torso(side, u * cut.armhole, 1)
      .lerp(torso(side, u * cut.armhole, -1), v), 28, 7));
    add('cloth', surface((u, v) => {
      const x = side * MathUtils.lerp(neckEdge, 1, u);
      const point = torso(x, 1, 1).lerp(torso(x, 1, -1), v);
      point.y += 0.017 * Math.sin(v * Math.PI);
      return point;
    }, 19, 12));
    add('stitch', tube(sample((u) => torso(side, 0.09 + u * (cut.armhole - 0.09), 1, 0.004), 30), 0.0028));
  }

  if (kind === 'hoodie') return;
  for (const face of [-1, 1]) {
    add('trim', surface((u, v) => {
      const x = (u * 2 - 1) * (neckEdge + (1 - v) * 0.043);
      return torso(x, 0.963 + v * 0.037, face, 0.008);
    }, 27, 8));
    add('stitch', tube(sample((u) => torso((u * 2 - 1) * neckEdge, 0.993, face, 0.010), 27), 0.004));
  }
}

function addSleeve(add, torso, kind, cut, side) {
  const long = kind === 'hoodie';
  function sleeve(u, v, face, lift = 0) {
    const root = torso(side, MathUtils.lerp(cut.armhole, 1, v), face);
    const cuffRun = (v * 2 - 1) * cut.cuff;
    const tip = new Vector3(side * (cut.cuffX + cuffRun),
      cut.cuffY + cuffRun * (long ? 0.38 : 0.76),
      (face * (long ? 0.068 : 0.094)) + (long ? 0.025 : 0.045));
    const point = root.lerp(tip, u);
    const drape = Math.sin(Math.PI * u);
    const across = Math.sin(Math.PI * v);
    point.x += side * drape * (long ? 0.079 + 0.125 * v : 0.018 + 0.018 * v);
    point.y -= drape * (long ? 0.065 : 0.038 * (1 - v));
    point.z += face * (drape * (0.026 + 0.030 * across) +
      0.013 * Math.sin(9 * v + u * 9) * across * drape + lift);
    return point;
  }

  for (const face of [-1, 1]) {
    add('cloth', surface((u, v) => sleeve(u, v, face), 40, 25));
    const trimStart = long ? 0.88 : 0.965;
    add('trim', surface((u, v) => sleeve(MathUtils.lerp(trimStart, 1, u), v, face, 0.006), 9, 24));
    add('stitch', tube(sample((v) => sleeve(trimStart, v, face, 0.008), 22), 0.0035));
    add('stitch', tube(sample((v) => sleeve(0.024, v, face, 0.006), 25), 0.0035));
  }
  for (const edge of [0, 1]) {
    add('cloth', surface((u, v) => {
      const point = sleeve(u, edge, 1).lerp(sleeve(u, edge, -1), v);
      point.y += (edge === 1 ? 1 : -1) * 0.015 * Math.sin(Math.PI * v) * Math.sin(Math.PI * u);
      return point;
    }, 40, 10));
  }
  const frontEdge = sample((v) => sleeve(1, v, 1, 0.005), 22);
  const backEdge = sample((v) => sleeve(1, 1 - v, -1, 0.005), 22);
  add('trim', closedSeam([...frontEdge, ...backEdge, frontEdge[0]], 0.007));
}

function addHood(add, torso) {
  function hoodPoint(u, v) {
    const angle = u * fullTurn;
    const high = Math.sin(angle);
    const taper = Math.cos(v * Math.PI / 2);
    const width = (0.254 + Math.sin(v * Math.PI) * 0.121) * (0.9 + 0.18 * high) * taper;
    return new Vector3(Math.cos(angle) * width,
      1.79 + high * (high > 0 ? 0.329 : 0.251) * taper - v * 0.046,
      0.103 - 0.410 * v + 0.055 * high * taper);
  }
  add('cloth', surface(hoodPoint, 52, 28));
  add('trim', surface((u, v) => hoodPoint(u, v * 0.085), 52, 5));
  add('stitch', closedSeam(sample((u) => hoodPoint(u, 0.02), 54), 0.006));
  add('stitch', tube(sample((u) => hoodPoint(0.25, u), 33), 0.0045));

  function pocket(u, v) {
    const width = MathUtils.lerp(0.80, 0.48, v);
    return torso((2 * u - 1) * width, 0.104 + v * 0.317, 1,
      0.010 + 0.018 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v));
  }
  add('cloth', surface(pocket, 29, 20));
  for (const edge of [0.024, 0.976]) {
    add('stitch', tube(sample((u) => pocket(edge, u), 20), 0.007));
  }
  add('stitch', tube(sample((u) => pocket(u, 1), 25), 0.004));
}

function addPrint(add, torso, material, face, center, width, bottom, top) {
  add(material, surface((u, v) =>
    torso(center + (u - 0.5) * width * face, MathUtils.lerp(bottom, top, v), face, 0.010),
  41, 43));
}

export function makeGarmentGeometry(kind) {
  const parts = [];
  const add = (material, geometry) => parts.push({ material, geometry });
  const cut = cuts[kind];
  const torso = makeTorso(kind);

  addBody(add, torso, kind, cut);
  for (const side of [-1, 1]) addSleeve(add, torso, kind, cut, side);
  if (kind === 'hoodie') {
    addHood(add, torso);
    addPrint(add, torso, 'frontArt', 1, 0, 1.53, 0.51, 0.83);
    addPrint(add, torso, 'backArt', -1, 0, 1.54, 0.27, 0.89);
  } else if (kind === 'tee') {
    addPrint(add, torso, 'frontArt', 1, 0.45, 0.32, 0.68, 0.85);
    addPrint(add, torso, 'backArt', -1, 0, 1.55, 0.32, 0.89);
  } else {
    addPrint(add, torso, 'frontArt', 1, 0, 1.65, 0.57, 0.85);
    addPrint(add, torso, 'backArt', -1, 0, 1.67, 0.26, 0.90);
  }
  return parts;
}
