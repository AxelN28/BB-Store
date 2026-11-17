import { useEffect, useMemo } from 'react';
import { CanvasTexture, DoubleSide, SRGBColorSpace, Vector3 } from 'three';
import { apparelDisplays } from '../apparelCatalog';
import { makeGarmentArt, makeWashedFabric } from './apparelArtwork';
import { makeGarmentGeometry } from './apparelGeometry';
import { tube } from './shoeGeometry';
import { createSurfaceTextures } from './shoeTextures';

const garments = Object.entries(apparelDisplays);

function makeHanger(hoodie = false) {
  const hook = [
    [0, 1.69, 0], [0, 1.94, 0], [0, 2.04, -0.028],
    [0, 2.13, -0.034], [0, 2.19, 0.038], [0, 2.16, 0.13], [0, 2.10, 0.16],
  ];
  const body = [[-0.53, 1.507, 0], [-0.26, 1.65, 0], [0, 1.79, 0], [0.27, 1.65, 0], [0.53, 1.51, 0]];
  return {
    hook: tube(hook.map(([x, y, z]) => new Vector3(x, y, z - (hoodie && y < 2.09 ? 0.225 : 0))), 0.014),
    shoulder: tube(body.map(([x, y, z]) => new Vector3(x, y - 0.10, z - (hoodie ? 0.16 : 0))), 0.034),
  };
}

function labelTexture(line, detail) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 152;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#282521';
  ctx.fillRect(0, 0, 768, 152);
  ctx.fillStyle = '#d4b78b';
  ctx.fillRect(26, 28, 3, 96);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f3e9d8';
  ctx.font = '700 46px sans-serif';
  ctx.fillText(line, 384, 70, 690);
  ctx.fillStyle = '#d4b78b';
  ctx.font = '600 23px sans-serif';
  ctx.fillText(detail, 384, 113, 690);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createGarments() {
  return garments.map(([, garment]) => ({
    parts: makeGarmentGeometry(garment.kind),
    prints: makeGarmentArt(garment.kind),
    tag: labelTexture(garment.label, garment.source.toUpperCase()),
  }));
}

function Garment({ garment, model, cloth, washed, hanger, selected, showBack }) {
  const isWashed = garment.kind === 'washed';
  const colors = {
    cloth: garment.fabric,
    trim: garment.trim,
    stitch: garment.trim,
  };
  const art = { frontArt: model.prints.front, backArt: model.prints.back };
  return (
    <>
      <mesh geometry={hanger.hook}>
        <meshStandardMaterial color="#bfa682" metalness={0.67} roughness={0.36} />
      </mesh>
      <group rotation-y={selected ? (showBack ? Math.PI + 0.12 : 0.10) : garment.angle}>
        <mesh geometry={hanger.shoulder}>
          <meshStandardMaterial color="#89684c" roughness={0.66} />
        </mesh>
        {model.parts.map(({ geometry, material }) => {
          const print = art[material];
          const textile = material === 'cloth' || material === 'trim';
          return (
            <mesh key={geometry.uuid} geometry={geometry} castShadow={material === 'cloth'} receiveShadow={textile}>
              <meshStandardMaterial
                color={colors[material] || '#ffffff'}
                map={print ?? (isWashed && textile ? washed : undefined)}
                bumpMap={textile ? cloth : undefined}
                bumpScale={garment.kind === 'hoodie' ? 0.013 : 0.009}
                roughness={0.96}
                alphaTest={print ? 0.36 : 0}
                polygonOffset={Boolean(print)}
                polygonOffsetFactor={-1}
                side={DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function ApparelDisplay({ position, selectedProduct, showBack, onSelectProduct }) {
  const models = useMemo(() => createGarments(), []);
  const hanger = useMemo(() => makeHanger(), []);
  const hoodHanger = useMemo(() => makeHanger(true), []);
  const washed = useMemo(() => makeWashedFabric(), []);
  const textures = useMemo(() => createSurfaceTextures(), []);
  const sign = useMemo(() => labelTexture('ROPA', 'ADIDAS ORIGINALS / GIRA DEBI TIRAR MAS FOTOS'), []);

  useEffect(() => () => {
    models.forEach(({ parts, prints, tag }) => {
      parts.forEach(({ geometry }) => geometry.dispose());
      Object.values(prints).forEach((texture) => texture.dispose());
      tag.dispose();
    });
    Object.values(hanger).forEach((geometry) => geometry.dispose());
    Object.values(hoodHanger).forEach((geometry) => geometry.dispose());
    washed.dispose();
    Object.values(textures).forEach((texture) => texture.dispose());
    sign.dispose();
  }, [models, hanger, hoodHanger, washed, textures, sign]);

  return (
    <group position={position} rotation-y={Math.PI / 2}>
      <mesh position={[0, 2.04, -0.66]} receiveShadow>
        <boxGeometry args={[6.59, 4.09, 0.14]} />
        <meshStandardMaterial color="#57463a" roughness={0.98} />
      </mesh>
      {[-3.27, 3.27].map((x) => (
        <mesh key={x} position={[x, 2.04, -0.574]}>
          <boxGeometry args={[0.025, 4.02, 0.02]} />
          <meshBasicMaterial color="#e6b981" toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.15, 0.08]} receiveShadow>
        <boxGeometry args={[6.5, 0.3, 1.64]} />
        <meshStandardMaterial color="#494239" roughness={0.83} />
      </mesh>
      <mesh position={[0, 0.255, 0.905]}>
        <boxGeometry args={[6.47, 0.025, 0.017]} />
        <meshStandardMaterial color="#b68e5a" metalness={0.55} roughness={0.37} />
      </mesh>
      {[-3.04, 3.04].map((x) => (
        <mesh key={x} position={[x, 1.76, 0.07]}>
          <cylinderGeometry args={[0.032, 0.042, 2.96, 16]} />
          <meshStandardMaterial color="#967757" metalness={0.56} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 3.25, 0.07]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.044, 0.044, 6.19, 18]} />
        <meshStandardMaterial color="#ae9069" metalness={0.58} roughness={0.38} />
      </mesh>
      <mesh position={[0, 3.68, -0.57]}>
        <planeGeometry args={[3.07, 0.61]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      <pointLight position={[-2.0, 3.77, 1.63]} intensity={13} color="#ffe5c9" distance={4.8} />
      <pointLight position={[2.03, 3.49, 1.4]} intensity={10} color="#fff0dd" distance={4.5} />
      {garments.map(([id, garment], index) => (
        <group key={id} onClick={onSelectProduct ? (event) => {
          if (event.delta > 6) return;
          event.stopPropagation();
          onSelectProduct(id);
        } : undefined}>
          <group position={[garment.x, 1.05, 0.09]}>
            <Garment garment={garment} model={models[index]} cloth={textures.suede} washed={washed}
              hanger={garment.kind === 'hoodie' ? hoodHanger : hanger}
              selected={selectedProduct === id} showBack={showBack} />
          </group>
          <mesh position={[garment.x, 0.48, 0.834]} rotation-x={-0.19}>
            <planeGeometry args={[1.82, 0.35]} />
            <meshBasicMaterial map={models[index].tag} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
