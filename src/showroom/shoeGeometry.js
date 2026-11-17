import {
  BufferGeometry, CatmullRomCurve3, CircleGeometry, Float32BufferAttribute,
  MathUtils, Quaternion, TubeGeometry, Vector3,
} from 'three';

const halfTurn = Math.PI;
export const fullTurn = halfTurn * 2;

export function surface(pointAt, rows, columns) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const u = row / rows;
      const v = column / columns;
      positions.push(...pointAt(u, v).toArray());
      uvs.push(u, v);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column;
        const b = a + columns + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function tube(points, radius, closed = false, sides = 6) {
  return new TubeGeometry(new CatmullRomCurve3(points, closed), Math.max(8, points.length * 2), radius, sides, closed);
}

export function disc(center, normal, width, height) {
  const geometry = new CircleGeometry(1, 14);
  geometry.scale(width, height, 1);
  geometry.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal));
  geometry.translate(center.x, center.y, center.z);
  return geometry;
}

export function sample(pointAt, count) {
  return Array.from({ length: count }, (_, index) => pointAt(index / (count - 1)));
}

export function createLast({ sections, stack, toeSpring, collarWidth, openingEnd }) {
  // Each section specifies its lengthwise coordinate, half-width and height above the sole.
  const profile = new CatmullRomCurve3(sections.map((section) => new Vector3(...section)), false, 'catmullrom', 0.45);
  const openingStart = 0.055;

  function deck(u) {
    return stack + toeSpring * MathUtils.smoothstep(u, 0.68, 1) + 0.022 * (1 - MathUtils.smoothstep(u, 0, 0.19));
  }

  function upper(u, angle) {
    const { x, y: width, z: height } = profile.getPoint(u);
    const elevation = Math.sin(angle);
    const arch = Math.sign(elevation) * Math.abs(elevation) ** 0.72;
    return new Vector3(x, deck(u) - 0.027 + arch * (arch >= 0 ? height : 0.095), Math.cos(angle) * width);
  }

  function gap(u) {
    const progress = (u - openingStart) / (openingEnd - openingStart);
    if (progress <= 0 || progress >= 1) return 0;
    return collarWidth * Math.sin(progress * halfTurn) ** 0.57;
  }

  function rim(u, side) {
    return upper(MathUtils.lerp(openingStart, openingEnd, u), halfTurn / 2 - side * gap(MathUtils.lerp(openingStart, openingEnd, u)));
  }

  function outer(u, angle, lift = 0) {
    const point = upper(u, angle);
    point.y += Math.sin(angle) * lift;
    point.z += Math.cos(angle) * lift;
    return point;
  }

  function outline(progress, widthScale) {
    const angle = progress * fullTurn;
    const u = (1 - Math.cos(angle)) / 2;
    const { x, y: width } = profile.getPoint(u);
    return new Vector3(x * 1.034, u, Math.sign(Math.sin(angle)) * width * widthScale);
  }

  function sole(rings) {
    return surface((u, v) => {
      const index = Math.min(Math.floor(v * (rings.length - 1)), rings.length - 2);
      const weight = v * (rings.length - 1) - index;
      const [widthA, heightA] = rings[index];
      const [widthB, heightB] = rings[index + 1];
      const point = outline(u, MathUtils.lerp(widthA, widthB, weight));
      const along = point.y;
      point.y = deck(along) - stack + MathUtils.lerp(heightA, heightB, weight);
      point.x *= MathUtils.lerp(0.89, 1, MathUtils.smoothstep(MathUtils.lerp(widthA, widthB, weight), 0, 1));
      return point;
    }, 96, (rings.length - 1) * 2);
  }

  function shell() {
    return surface((u, v) => {
      const cutout = gap(u);
      return upper(u, halfTurn / 2 + cutout + v * (fullTurn - 2 * cutout));
    }, 88, 54);
  }

  function opening() {
    const path = [...sample((u) => rim(u, 1), 28).slice(0, -1), ...sample((u) => rim(1 - u, -1), 28).slice(0, -1)];
    const middle = new Vector3().addVectors(path[0], path[27]).multiplyScalar(0.5);
    const lining = surface((u, v) => {
      const index = u * path.length;
      const point = path[Math.floor(index) % path.length].clone();
      point.lerp(path[(Math.floor(index) + 1) % path.length], index % 1);
      point.x = MathUtils.lerp(point.x, middle.x, v * 0.65);
      point.z *= 1 - v * 0.73;
      point.y = MathUtils.lerp(point.y, stack + 0.018, v);
      return point;
    }, path.length, 7);
    return { path, lining };
  }

  return { deck, outer, outline, sole, shell, opening };
}
