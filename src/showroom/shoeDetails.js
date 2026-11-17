import { MathUtils, Vector3 } from 'three';
import { disc, sample, surface, tube } from './shoeGeometry';

const top = Math.PI / 2;

export function addSole(add, last, design, productId) {
  const height = design.stack;
  const treadHeight = productId === 'response' ? 0.074 : 0.044;
  add('tread', last.sole([[0, 0], [0.96, 0], [1.016, 0.018], [1.016, treadHeight], [0, treadHeight]]));
  add('sole', last.sole([
    [0, treadHeight - 0.006], [1.021, treadHeight - 0.006], [1.063, treadHeight + 0.025],
    [1.067, height * 0.59], [1.048, height * 0.78], [1.006, height - 0.028], [0, height - 0.026],
  ]));
  add('welt', last.sole([
    [1.047, height * 0.76], [1.072, height * 0.8], [1.077, height * 0.86],
    [1.05, height * 0.95], [1.013, height + 0.009], [0, height + 0.009],
  ]));

  if (productId === 'response') {
    for (const side of [-1, 1]) {
      const heelWindow = sample((u) => {
        const point = last.outline(side === 1 ? 0.015 + u * 0.16 : 0.985 - u * 0.16, 1.073);
        point.y = 0.093 + last.deck(point.y) - height;
        return point;
      }, 16);
      add('trim', tube(heelWindow, 0.018));

      // The runner's midsole has separate raised sections along the arch and forefoot.
      for (const [from, to, crest] of [[0.16, 0.237, 0.166], [0.243, 0.31, 0.155], [0.315, 0.382, 0.158], [0.387, 0.45, 0.139]]) {
        add('solePod', surface((u, v) => {
          const progress = MathUtils.lerp(from, to, u);
          const point = last.outline(side === 1 ? progress : 1 - progress, 1.068 + 0.065 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI));
          const rise = last.deck(point.y) - height;
          point.y = rise + MathUtils.lerp(0.042, crest - 0.035 * Math.cos(u * Math.PI * 2), v);
          return point;
        }, 14, 6));
      }
    }
  }
}

function addTongue(add, last, design, productId) {
  const { laceStart, laceEnd, tongueLift } = design;
  const back = laceStart - (productId === 'response' ? 0.088 : 0.116);
  const front = laceEnd + 0.038;

  function tonguePoint(u, v, extra = 0) {
    const along = MathUtils.lerp(back + 0.022 * Math.abs(v * 2 - 1) ** 3, front, u);
    const width = MathUtils.lerp(0.48, 0.66, Math.sin(u * Math.PI));
    const point = last.outer(along, top + (2 * v - 1) * width, 0.02 + extra);
    point.y += tongueLift * (1 - u) ** 2 + 0.016 * Math.sin(v * Math.PI) * (1 - u);
    return point;
  }

  if (productId !== 'response') {
    add('tongueEdge', surface((u, v) => {
      const point = tonguePoint(u, v);
      point.x -= 0.034 * (1 - u);
      point.y -= 0.035 * (1 - u) + 0.012;
      point.z *= 1.18;
      return point;
    }, 28, 16));
  }
  add('tongue', surface((u, v) => tonguePoint(u, v), 30, 20));
  const border = [
    ...sample((u) => tonguePoint(u, 0, 0.005), 20).slice(0, -1),
    ...sample((v) => tonguePoint(1, v, 0.005), 12).slice(0, -1),
    ...sample((u) => tonguePoint(1 - u, 1, 0.005), 20).slice(0, -1),
    ...sample((v) => tonguePoint(0, 1 - v, 0.005), 12).slice(0, -1),
  ];
  add('tongueEdge', tube(border, 0.012, true));
  add('tongueEdge', surface((u, v) => {
    const position = u * border.length;
    const index = Math.floor(position) % border.length;
    const point = border[index].clone().lerp(border[(index + 1) % border.length], position % 1);
    point.y -= v * 0.029;
    return point;
  }, border.length, 2));

  if (productId !== 'response') {
    const center = tonguePoint(0.16, 0.5, 0.014);
    addEyeBadge(add, center, new Vector3(0.42, 0.91, 0).normalize(), 0.071);
  }
}

function addEyeBadge(add, center, normal, size) {
  add('badge', disc(center, normal, size * 0.92, size * 0.67));
  add('emblem', disc(center.clone().addScaledVector(normal, 0.002), normal, size * 0.34, size * 0.39));
  const glint = center.clone().addScaledVector(normal, 0.003);
  glint.y += size * 0.12;
  glint.z += size * 0.12;
  add('badge', disc(glint, normal, size * 0.1, size * 0.1));
}

function addLaces(add, last, design, productId) {
  const { laceStart, laceEnd, laceRows } = design;

  function lace(u, finish, v) {
    const point = last.outer(MathUtils.lerp(u, finish, v), MathUtils.lerp(0.78, Math.PI - 0.78, v), 0.028);
    const progress = MathUtils.clamp((u - laceStart + 0.12) / (laceEnd - laceStart + 0.16), 0, 1);
    const padding = design.tongueLift * (1 - progress) ** 2;
    point.y += (0.035 + padding) * Math.sin(Math.PI * v) ** 1.5 + 0.008;
    return point;
  }

  for (let row = 0; row < laceRows; row++) {
    const u = MathUtils.lerp(laceStart, laceEnd, row / (laceRows - 1));
    const step = (laceEnd - laceStart) / (laceRows - 1);
    if (productId === 'forum' && row < laceRows - 1) {
      add('laces', tube(sample((v) => lace(u, u + step, v), 9), 0.015));
      add('laces', tube(sample((v) => lace(u + step, u, v).add(new Vector3(0, 0.012 * Math.sin(Math.PI * v), 0)), 9), 0.015));
    } else if (productId !== 'forum') {
      add('laces', tube(sample((v) => lace(u, u + step * 0.27, v), 11),
        productId === 'campus' ? 0.023 : 0.015));
    }
    for (const side of [-1, 1]) {
      const angle = side === 1 ? 0.78 : Math.PI - 0.78;
      const center = last.outer(u + (side === -1 && productId !== 'forum' ? step * 0.27 : 0), angle, 0.027);
      const normal = new Vector3(0.14, 0.7, side * 0.7).normalize();
      add('eyelet', disc(center, normal, 0.026, 0.022));
    }
  }
}

function addToe(add, last, productId) {
  const front = productId === 'response' ? 0.75 : 0.735;
  add('toe', surface((u, v) => {
    const angle = MathUtils.lerp(0.03, Math.PI - 0.03, v);
    const edge = front + 0.055 * Math.sin(angle);
    return last.outer(MathUtils.lerp(edge, 1, u), angle, 0.009 * Math.sin(Math.PI * u * 0.7) + 0.008);
  }, 32, 36));
  add('edge', tube(sample((u) => {
    const angle = MathUtils.lerp(0.13, Math.PI - 0.13, u);
    return last.outer(front + 0.055 * Math.sin(angle), angle, 0.013);
  }, 31), 0.006));

  if (productId === 'forum') {
    for (const side of [-1, 1]) {
      add('overlay', surface((u, v) => {
        const angle = MathUtils.lerp(0.032, 0.35 + 0.77 * MathUtils.smoothstep(u, 0.6, 1), v);
        return last.outer(MathUtils.lerp(0.755, 0.999, u), side === 1 ? angle : Math.PI - angle, 0.019);
      }, 26, 11));
    }

    for (let row = 0; row < 5; row++) {
      const count = row === 4 ? 5 : 7;
      for (let dot = 0; dot < count; dot++) {
        const angle = top + (dot - (count - 1) / 2) * 0.18 + (row % 2) * 0.065;
        const center = last.outer(0.83 + row * 0.025, angle, 0.018);
        const normal = new Vector3(0.36 + row * 0.08, Math.sin(angle), Math.cos(angle) * 0.54).normalize();
        add('emblem', disc(center, normal, 0.008, 0.006));
      }
    }
  }
}

function addSideDetails(add, last, design, productId, side) {
  const sideAngle = (angle) => side === 1 ? angle : Math.PI - angle;
  const at = (u, angle, lift) => last.outer(u, sideAngle(angle), lift);
  const band = (key, from, to, lower, upper, lift, rows = 32) => {
    add(key, surface((u, v) => {
      const position = MathUtils.lerp(from, to, u);
      return at(position, MathUtils.lerp(lower(u), upper(u), v), lift);
    }, rows, 8));
  };

  band('eyestay', design.laceStart - 0.04, design.laceEnd + 0.03,
    (u) => 0.61 + 0.06 * Math.sin(u * Math.PI), () => 0.98, 0.018);
  const eyestayEdge = (u) => at(MathUtils.lerp(design.laceStart - 0.04, design.laceEnd + 0.03, u),
    0.61 + 0.06 * Math.sin(u * Math.PI), 0.022);
  add('edge', tube(sample(eyestayEdge, 25), 0.006));
  for (let stitch = 0; stitch < 17; stitch++) {
    const start = (stitch + 0.24) / 17;
    add('stitch', tube([eyestayEdge(start), eyestayEdge(start + 0.027)], 0.0024));
  }

  if (productId === 'response') {
    const wave = (u) => 0.21 + 0.13 * Math.sin(u * 28) + 0.035 * Math.cos(u * 63);
    band('overlay', 0.08, 0.965, (u) => Math.max(-0.06, wave(u) - 0.15), (u) => wave(u) + 0.16, 0.016, 65);
    band('edge', 0.08, 0.965, (u) => wave(u) + 0.116, (u) => wave(u) + 0.148, 0.019, 65);
    const web = (u) => 0.52 + 0.13 * Math.cos(23 * u) + 0.07 * Math.sin(42 * u);
    band('overlay', 0.13, 0.88, (u) => web(u) - 0.07, (u) => web(u) + 0.085, 0.017, 57);
    band('edge', 0.13, 0.88, (u) => web(u) + 0.043, (u) => web(u) + 0.072, 0.022, 57);
  } else {
    band('overlay', 0.015, 0.29, () => 0.05, (u) => 1.07 - u * 0.71, 0.01);
    add('edge', tube(sample((u) => at(0.256 + 0.031 * u, 0.08 + u * 0.36, 0.014), 16), 0.005));
    if (productId === 'forum') band('overlay', 0.52, 0.93, () => 0.04, (u) => 0.22 + 0.09 * u, 0.013);
  }

  if (productId === 'campus') {
    add('campusMark', surface((u, v) => {
      const progress = side === 1 ? u : 1 - u;
      return at(0.321 + progress * 0.087 + v * 0.016, 0.45 + v * 0.16, 0.016);
    }, 12, 6));
  }

  for (let stripe = 0; stripe < 3; stripe++) {
    const start = 0.375 + stripe * (productId === 'response' ? 0.064 : 0.073);
    const width = productId === 'campus' ? 0.041 : 0.039;
    const slope = productId === 'campus' ? 0.096 : 0.042;
    const bottom = productId === 'forum' ? 0.18 : 0.06;
    const stripePoint = (u, v, lift) => at(start + width * u + slope * v - 0.012 * Math.sin(v * Math.PI),
      MathUtils.lerp(bottom, 0.68, v), lift);
    add('stripe', surface((u, v) => stripePoint(u, v, 0.027), 6, 18));
    add('stripeAccent', surface((u, v) => stripePoint(0.15 + 0.11 * u, v, 0.030), 2, 18));
  }
}

function addForumStrap(add, last) {
  const pointAt = (u, v) => last.outer(0.415 + u * 0.071 + 0.012 * Math.sin(Math.PI * v),
    0.43 + v * (Math.PI - 0.86), 0.075 + 0.088 * Math.sin(v * Math.PI) ** 2);
  add('strap', surface(pointAt, 12, 36));
  for (const edge of [0.12, 0.88]) {
    const seam = sample((v) => pointAt(edge, v), 30);
    add('edge', tube(seam, 0.0036));
  }

  const bucklePoint = (u, v) => last.outer(0.405 + u * 0.096, 0.43 + v * 0.33, 0.122);
  const frame = [bucklePoint(0, 0.17), bucklePoint(0.12, 0), bucklePoint(0.83, 0), bucklePoint(1, 0.18),
    bucklePoint(1, 0.82), bucklePoint(0.83, 1), bucklePoint(0.12, 1), bucklePoint(0, 0.82)];
  add('buckle', tube(frame, 0.02, true, 8));
  add('buckle', tube(sample((v) => bucklePoint(0.54, v), 8), 0.014));
}

export function addUpperDetails(add, last, design, productId) {
  addTongue(add, last, design, productId);
  addLaces(add, last, design, productId);
  addToe(add, last, productId);
  for (const side of [-1, 1]) addSideDetails(add, last, design, productId, side);
  if (productId === 'forum') {
    addForumStrap(add, last);
    const loop = sample((u) => new Vector3(-0.973 - Math.sin(u * Math.PI) * 0.12,
      design.stack + 0.46 + Math.sin(u * Math.PI) * 0.23, Math.cos(u * Math.PI) * 0.055), 15);
    add('laces', tube(loop, 0.018));
  }
  if (productId === 'response') {
    const normal = new Vector3(-0.87, 0.23, 0.44).normalize();
    const heel = last.outer(0.075, 0.81, 0.019);
    heel.x -= 0.021;
    add('trim', disc(heel, normal, 0.104, 0.066));
    addEyeBadge(add, heel.clone().addScaledVector(normal, 0.003), normal, 0.045);
  }
}
