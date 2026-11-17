import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { CanvasTexture, DoubleSide, ImageLoader, SRGBColorSpace, Vector3 } from 'three';
import { capDisplays } from '../capCatalog';
import yankeesBadge from '../assets/caps/yankees.svg';
import metsBadge from '../assets/caps/mets.svg';
import { disc, fullTurn, sample, surface, tube } from './shoeGeometry';
import { createSurfaceTextures } from './shoeTextures';

const caps = Object.entries(capDisplays);
const badgeUrls = [yankeesBadge, metsBadge];
const shelfTops = [0.84, 2.27];

function makeTexture(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext('2d'));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeBadge(image, color, mets = false) {
  return makeTexture(256, 256, (ctx) => {
    ctx.drawImage(image, 0, 0, 256, 256);
    // The source mark includes a small TM outside the cap embroidery.
    if (mets) ctx.clearRect(198, 149, 22, 12);
    else ctx.clearRect(201, 172, 22, 14);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = 'rgba(255,255,255,0.32)';
    ctx.lineWidth = 1.6;
    for (let x = -200; x < 256; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 200, 256);
      ctx.stroke();
    }
  });
}

function makeSidePatch() {
  return makeTexture(128, 192, (ctx) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#143a46';
    ctx.lineWidth = 7;
    ctx.fillStyle = '#f2efde';
    ctx.beginPath();
    ctx.ellipse(62, 24, 32, 13, -0.15, 0, fullTurn);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(35, 26);
    ctx.lineTo(32, 43);
    ctx.lineTo(56, 32);
    ctx.fill();
    ctx.fillStyle = '#2c5a63';
    ctx.font = 'italic bold 12px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nuevayol', 62, 28);

    ctx.fillStyle = '#e25736';
    ctx.beginPath();
    ctx.roundRect(43, 112, 38, 56, 8);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = '#fb9561';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(61, 138);
    ctx.lineTo(61, 165);
    ctx.stroke();

    ctx.fillStyle = '#2999a0';
    ctx.strokeStyle = '#15737f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(47, 77);
    ctx.lineTo(74, 75);
    ctx.lineTo(91, 99);
    ctx.lineTo(78, 122);
    ctx.lineTo(44, 120);
    ctx.lineTo(34, 104);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = '#70c9d0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 81);
    ctx.lineTo(59, 110);
    ctx.lineTo(72, 87);
    ctx.stroke();

    ctx.fillStyle = '#c6a146';
    ctx.strokeStyle = '#315156';
    ctx.beginPath();
    ctx.moveTo(45, 71);
    ctx.lineTo(45, 51);
    ctx.lineTo(55, 54);
    ctx.lineTo(72, 51);
    ctx.lineTo(77, 69);
    ctx.quadraticCurveTo(63, 83, 45, 71);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = '#282924';
    ctx.fillRect(50, 56, 5, 5);
    ctx.fillRect(68, 55, 5, 5);

    ctx.fillStyle = '#4ea9c1';
    ctx.fillRect(41, 167, 16, 10);
    ctx.fillRect(67, 166, 16, 10);
  });
}

function makeBackPatch(fitted) {
  return makeTexture(320, 120, (ctx) => {
    ctx.fillStyle = '#efeee4';
    ctx.font = 'italic bold 61px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nuevayol', 160, fitted ? 61 : 72, 300);
    ctx.strokeStyle = '#e1dfd3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (fitted) {
      ctx.fillStyle = '#f2efe6';
      ctx.beginPath();
      ctx.roundRect(126, 77, 68, 36, 6);
      ctx.fill();
      ctx.fillStyle = '#303a50';
      ctx.fillRect(132, 82, 30, 25);
      ctx.fillStyle = '#9e393d';
      ctx.fillRect(162, 82, 26, 25);
      ctx.fillStyle = '#f2efe6';
      ctx.beginPath();
      ctx.arc(165, 91, 6, 0, fullTurn);
      ctx.moveTo(152, 103);
      ctx.lineTo(162, 95);
      ctx.lineTo(169, 94);
      ctx.lineTo(181, 106);
      ctx.lineTo(151, 106);
      ctx.fill();
      return;
    }
    ctx.moveTo(85, 85);
    ctx.quadraticCurveTo(165, 70, 236, 85);
    ctx.stroke();
  });
}

function makeVisorLabel(fitted) {
  return makeTexture(200, 200, (ctx) => {
    ctx.beginPath();
    ctx.arc(100, 100, 91, 0, fullTurn);
    ctx.fillStyle = fitted ? '#cda856' : '#c7cdd0';
    ctx.fill();
    ctx.strokeStyle = '#30363c';
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.fillStyle = '#25282c';
    ctx.textAlign = 'center';
    ctx.font = 'bold 23px sans-serif';
    ctx.fillText('NEW ERA', 100, 70);
    ctx.font = '900 34px sans-serif';
    ctx.fillText(fitted ? '59FIFTY' : '19TWENTY', 100, 107, 174);
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(fitted ? 'TALLA FIJA' : 'AJUSTABLE', 100, 140);
  });
}

function makeLabel(title, subtitle, header = false) {
  return makeTexture(header ? 640 : 384, header ? 128 : 120, (ctx) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.fillStyle = header ? '#2c2420' : '#523b2a';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#b99063';
    ctx.lineWidth = 2;
    ctx.strokeRect(7, 7, width - 14, height - 14);
    ctx.fillStyle = '#f3e7d5';
    ctx.font = `bold ${header ? 65 : 40}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, header ? 70 : 61);
    ctx.fillStyle = '#e1ba86';
    ctx.font = `bold ${header ? 24 : 23}px sans-serif`;
    ctx.fillText(subtitle, width / 2, height - 24, width - 34);
  });
}

function makeCap(design) {
  const fitted = design.selectableSize;
  const height = fitted ? 0.57 : 0.50;
  const curve = fitted ? 0.026 : 0.155;

  function crownAt(angle, rise, offset = 0) {
    const radius = Math.cos(rise * Math.PI / 2) ** (fitted ? 0.50 : 0.63);
    const panel = Math.sin(angle * 6) ** 2 * 0.004 * Math.sin(Math.PI * rise);
    const y = 0.045 + height * Math.sin(rise * Math.PI / 2);
    return new Vector3(Math.sin(angle) * (0.44 * radius + offset + panel), y,
      Math.cos(angle) * (0.488 * radius + offset + panel) - 0.029 * rise);
  }

  function riseAt(angle) {
    const across = (angle - Math.PI) / 0.47;
    return fitted ? 0 : 0.29 * Math.sqrt(Math.max(0, 1 - across * across));
  }

  function visorAt(u, v, lift = 0) {
    const side = u * 2 - 1;
    const x = side * (0.34 + Math.sin(v * Math.PI * 0.77) * 0.106);
    const z = 0.27 + 0.56 * v + (1 - side * side) * (0.115 + v * 0.048) -
      0.08 * v ** 4 * Math.abs(side) ** 8;
    const y = 0.115 - curve * (0.58 * side * side + 0.19 * v) + lift;
    return new Vector3(x, y, z);
  }

  const crown = surface((u, v) => {
    const angle = u * fullTurn;
    return crownAt(angle, riseAt(angle) + (1 - riseAt(angle)) * v);
  }, 72, 28);
  const visor = surface(visorAt, 36, 16);
  const edge = tube([
    ...sample((u) => visorAt(u, 1), 32).slice(0, -1),
    ...sample((v) => visorAt(1, 1 - v), 12).slice(0, -1),
    ...sample((u) => visorAt(1 - u, 0), 24).slice(0, -1),
    ...sample((v) => visorAt(0, v), 12).slice(0, -1),
  ], 0.012, true);
  const seams = Array.from({ length: 6 }, (_, index) => {
    const angle = index * fullTurn / 6;
    const base = riseAt(angle);
    return tube(sample((v) => crownAt(angle, base + v * (0.985 - base), 0.004), 15), 0.0045);
  });
  const hem = tube(sample((u) => {
    const angle = u * fullTurn;
    return crownAt(angle, riseAt(angle) + 0.014, 0.004);
  }, 100).slice(0, -1), 0.005, true);
  const stitches = [0.43, 0.55, 0.67, 0.79, 0.90].map((v) =>
    tube(sample((u) => visorAt(0.045 + u * 0.91, v, 0.006), 34), 0.0023));
  const eyelets = Array.from({ length: 6 }, (_, index) => {
    const angle = (index + 0.5) * fullTurn / 6;
    const normal = new Vector3(Math.sin(angle), 0.5, Math.cos(angle)).normalize();
    return disc(crownAt(angle, 0.54, 0.009), normal, 0.013, 0.016);
  });
  const badge = surface((u, v) => crownAt((u - 0.5) * 1.21, 0.105 + v * 0.63, 0.010), 28, 22);
  const patch = surface((u, v) => crownAt(1.03 + (u - 0.5) * 0.50, 0.08 + v * 0.59, 0.010), 20, 20);
  const back = surface((u, v) => crownAt(Math.PI + (u - 0.5) * 1.03, (fitted ? 0.036 : 0.30) + v * (fitted ? 0.295 : 0.23), 0.009), 24, 14);
  const sticker = surface((u, v) => visorAt(0.56 + (u - 0.5) * 0.27, 0.65 - (v - 0.5) * 0.33, 0.008), 15, 13);
  const strap = fitted ? null : surface((u, v) => {
    const point = crownAt(Math.PI + (u - 0.5) * 1.0, 0.020 + v * 0.084, 0.008);
    return point;
  }, 25, 4);
  const studs = fitted ? [] : Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI + (index - 2.5) * 0.085;
    return disc(crownAt(angle, 0.06, 0.011), new Vector3(Math.sin(angle), 0, Math.cos(angle)), 0.011, 0.011);
  });
  const label = makeLabel(design.team, fitted ? '59FIFTY · TALLA FIJA' : '19TWENTY · AJUSTABLE');
  const geometries = [crown, visor, edge, hem, badge, patch, back, sticker, ...seams, ...stitches, ...eyelets, ...studs];
  if (strap) geometries.push(strap);

  return {
    crown, visor, edge, hem, seams, stitches, eyelets, badge, patch, back, sticker, strap, studs, label, height,
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      label.dispose();
    },
  };
}

function Cap({ productId, design, model, textures, selected, showBack, onSelect }) {
  const angle = selected ? (showBack ? Math.PI + 0.13 : -0.36) : design.angle;
  const details = [...model.seams, model.hem, ...model.stitches];

  return (
    <group position={[design.x, design.shelf + 0.012, selected ? 0.70 : 0.07]}
      rotation-y={angle} onClick={(event) => {
        if (!onSelect || event.delta > 6) return;
        event.stopPropagation();
        onSelect(productId);
      }}>
      <mesh geometry={model.crown} castShadow receiveShadow>
        <meshStandardMaterial color={design.crown} side={DoubleSide} roughness={0.98} bumpMap={textures.weave} bumpScale={0.006} />
      </mesh>
      <mesh geometry={model.visor} castShadow receiveShadow>
        <meshStandardMaterial color={design.crown} side={DoubleSide} roughness={0.94} bumpMap={textures.weave} bumpScale={0.003} />
      </mesh>
      <mesh geometry={model.edge}>
        <meshStandardMaterial color={design.crown} roughness={0.9} />
      </mesh>
      {details.map((geometry) => (
        <mesh key={geometry.uuid} geometry={geometry}>
          <meshStandardMaterial color={design.crown} roughness={0.8} />
        </mesh>
      ))}
      {[...model.eyelets, ...model.studs].map((geometry) => (
        <mesh key={geometry.uuid} geometry={geometry}>
          <meshStandardMaterial color="#130f10" side={DoubleSide} roughness={1} />
        </mesh>
      ))}
      {model.strap && (
        <mesh geometry={model.strap}>
          <meshStandardMaterial color={design.crown} side={DoubleSide} roughness={0.95} />
        </mesh>
      )}
      <mesh position={[0, model.height + 0.049, -0.03]}>
        <sphereGeometry args={[0.041, 15, 10]} />
        <meshStandardMaterial color={design.badge === 'mets' ? design.lettering : design.crown} roughness={0.85} />
      </mesh>
      {[
        ['monogram', model.badge, textures.badges[design.badge]],
        ['side', model.patch, textures.patch],
        ['back', model.back, design.selectableSize ? textures.fittedBack : textures.snapbackBack],
        ['sticker', model.sticker, design.selectableSize ? textures.fitted : textures.snapback],
      ].map(([key, geometry, texture]) => (
        <mesh key={key} geometry={geometry}>
          <meshStandardMaterial map={texture} alphaTest={0.4} roughness={0.94} side={DoubleSide}
            polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      ))}
    </group>
  );
}

export default function CapDisplay({ position, selectedProduct, showBack, onSelectProduct }) {
  const [yankees, mets] = useLoader(ImageLoader, badgeUrls);
  const models = useMemo(() => caps.map(([, design]) => makeCap(design)), []);
  const textures = useMemo(() => {
    const cloth = createSurfaceTextures();
    return {
      cloth, weave: cloth.weave,
      badges: { yankees: makeBadge(yankees, '#efeee9'), mets: makeBadge(mets, '#f3591f', true) },
      patch: makeSidePatch(), fittedBack: makeBackPatch(true), snapbackBack: makeBackPatch(false),
      fitted: makeVisorLabel(true), snapback: makeVisorLabel(false),
      sign: makeLabel('NUEVAYoL', 'NEW ERA × BAD BUNNY × FRSH × MLB', true),
    };
  }, [yankees, mets]);

  useEffect(() => () => {
    models.forEach((model) => model.dispose());
  }, [models]);

  useEffect(() => () => {
    Object.values(textures.cloth).forEach((texture) => texture.dispose());
    Object.values(textures.badges).forEach((texture) => texture.dispose());
    [textures.patch, textures.fittedBack, textures.snapbackBack, textures.fitted, textures.snapback, textures.sign].forEach((texture) => texture.dispose());
  }, [textures]);
  return (
    <group position={position} rotation-y={-Math.PI / 2}>
      <mesh position={[0, 1.98, -0.47]} receiveShadow>
        <boxGeometry args={[3.6, 3.96, 0.25]} />
        <meshStandardMaterial color="#665044" roughness={0.98} />
      </mesh>
      {[-1.78, 1.78].map((x) => (
        <group key={x} position-x={x}>
          <mesh position-y={1.98} castShadow receiveShadow>
            <boxGeometry args={[0.14, 3.96, 1.22]} />
            <meshStandardMaterial color="#3d2e24" roughness={0.79} />
          </mesh>
          <mesh position={[0, 1.98, 0.625]}>
            <boxGeometry args={[0.033, 3.76, 0.025]} />
            <meshStandardMaterial color="#b18b5a" metalness={0.42} roughness={0.39} />
          </mesh>
        </group>
      ))}
      {[0.14, ...shelfTops, 3.67].map((height) => (
        <group key={height} position-y={height - 0.065}>
          <mesh position-z={0.20} receiveShadow>
            <boxGeometry args={[3.5, 0.13, 1.57]} />
            <meshStandardMaterial color="#795c43" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.04, 0.991]}>
            <boxGeometry args={[3.46, 0.021, 0.015]} />
            <meshBasicMaterial color="#ffd2a1" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 3.93, 0.83]}>
        <boxGeometry args={[3.5, 0.49, 0.32]} />
        <meshStandardMaterial color="#3d2e24" roughness={0.82} />
      </mesh>
      <mesh position={[0, 3.93, 1]}>
        <planeGeometry args={[2.68, 0.43]} />
        <meshBasicMaterial map={textures.sign} toneMapped={false} />
      </mesh>
      <pointLight position={[-0.72, 3.42, 0.78]} color="#ffdfb6" intensity={6} distance={3.15} />
      <pointLight position={[0.77, 1.98, 0.88]} color="#e8d8c5" intensity={4.2} distance={2.8} />
      {caps.map(([productId, design], index) => (
        <group key={productId}>
          <Cap productId={productId} design={design} model={models[index]} textures={textures}
            selected={selectedProduct === productId} showBack={showBack} onSelect={onSelectProduct} />
          <mesh position={[design.x, design.shelf - 0.11, 1.00]}
            onClick={onSelectProduct ? (event) => {
              if (event.delta > 6) return;
              event.stopPropagation();
              onSelectProduct(productId);
            } : undefined}>
            <planeGeometry args={[1.23, 0.30]} />
            <meshBasicMaterial map={models[index].label} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
