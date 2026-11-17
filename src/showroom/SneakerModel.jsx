import { useEffect, useMemo } from 'react';
import { DoubleSide, FrontSide, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { shoeDesigns } from './shoeDesigns';
import { addSole, addUpperDetails } from './shoeDetails';
import { createLast, disc, tube } from './shoeGeometry';
import { createCampusMark, createSurfaceTextures } from './shoeTextures';

const accents = {
  emblem: '#342a2a',
  campusMark: '#f8eee3',
};

function buildShoe(productId) {
  const design = shoeDesigns[productId];
  const last = createLast(design);
  const textures = createSurfaceTextures();
  if (productId === 'campus') textures.campusMark = createCampusMark();
  const pieces = new Map();

  function add(material, geometry) {
    if (!pieces.has(material)) pieces.set(material, []);
    pieces.get(material).push(geometry);
  }

  add('body', last.shell());
  const { path, lining } = last.opening();
  add('lining', lining);
  add('lining', disc(new Vector3(-0.64, design.stack + 0.021, 0), new Vector3(0, 1, 0), 0.32, 0.24));
  add('collar', tube(path, productId === 'response' ? 0.035 : 0.049, true, 10));
  addSole(add, last, design, productId);
  addUpperDetails(add, last, design, productId);

  const meshes = Array.from(pieces, ([name, geometries]) => {
    const geometry = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries);
    if (geometries.length > 1) geometries.forEach((piece) => piece.dispose());
    const textile = ['body', 'toe', 'overlay', 'eyestay'].includes(name);
    const woven = ['laces', 'strap', 'lining'].includes(name);
    const texture = textile ? textures[design.finish] : woven ? textures.weave : textures[name];
    return {
      name,
      geometry,
      color: design.colors[name] ?? accents[name],
      texture,
      castsShadow: ['body', 'sole', 'tread', 'collar', 'tongue'].includes(name),
    };
  });

  function dispose() {
    meshes.forEach(({ geometry }) => geometry.dispose());
    Object.values(textures).forEach((texture) => texture.dispose());
  }
  return { meshes, dispose };
}

export default function SneakerModel({ productId }) {
  const { meshes, dispose } = useMemo(() => buildShoe(productId), [productId]);
  useEffect(() => dispose, [dispose]);

  return meshes.map(({ name, geometry, color, texture, castsShadow }) => (
    <mesh key={name} geometry={geometry} castShadow={castsShadow} receiveShadow={castsShadow}>
      <meshStandardMaterial
        color={color}
        map={texture}
        alphaTest={name === 'campusMark' ? 0.35 : 0}
        bumpMap={name === 'campusMark' ? undefined : texture}
        bumpScale={name === 'body' ? 0.005 : 0.003}
        roughness={name === 'buckle' ? 0.34 : name === 'stripe' ? 0.64 : 0.86}
        metalness={name === 'buckle' ? 0.37 : 0}
        side={castsShadow ? FrontSide : DoubleSide}
      />
    </mesh>
  ));
}
