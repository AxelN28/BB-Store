import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { apparelDisplays } from '../apparelCatalog';
import { capDisplays } from '../capCatalog';
import ApparelDisplay from './ApparelDisplay';
import CapDisplay from './CapDisplay';
import SneakerModel from './SneakerModel';
import StoreEnvironment from './StoreEnvironment';

const showroomCenter = [0, 2.85, 6.4];
const capDisplayPosition = [8.55, 0, showroomCenter[2]];
const apparelDisplayPosition = [-8.15, 0, showroomCenter[2]];

const displays = {
  response: { position: [-2.6, 0, -2.25], height: 0.8, color: '#433b34', angle: 0.46 },
  campus: { position: [0, 0, -3.05], height: 1.03, color: '#765641', angle: -0.42 },
  forum: { position: [2.6, 0, -2.25], height: 0.8, color: '#433b34', angle: -0.52 },
};

function ProductDisplay({ productId, onSelectProduct }) {
  const { position, height, color, angle } = displays[productId];

  return (
    <group position={position} onClick={(event) => {
      if (!onSelectProduct || event.delta > 6) return;
      event.stopPropagation();
      onSelectProduct(productId);
    }}>
      <mesh position-y={height / 2} castShadow receiveShadow>
        <cylinderGeometry args={[1.17, 1.24, height, 48]} />
        <meshStandardMaterial color={color} roughness={0.83} />
      </mesh>
      <mesh position-y={height - 0.09}>
        <cylinderGeometry args={[1.19, 1.19, 0.022, 48]} />
        <meshStandardMaterial color="#aa7950" metalness={0.5} roughness={0.45} />
      </mesh>
      <group position-y={height + 0.012} rotation-y={angle} scale={0.95}>
        <SneakerModel productId={productId} />
      </group>
    </group>
  );
}

function CameraController({ entered, selectedProduct, zone }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => invalidate(), [entered, selectedProduct, zone, invalidate]);

  const shotRef = useRef({
    position: new Vector3(),
    focus: new Vector3(),
    yaw: 0,
    pitch: 0,
    zoom: 1,
    offset: new Vector3(),
    currentOffset: new Vector3(),
    initialized: false,
    inMotion: false,
  });

  useFrame(({ camera, size }, delta) => {
    const { width, height } = size;
    if (!width || !height) return;

    const shot = shotRef.current;
    const aspect = width / height;
    const display = displays[selectedProduct];
    const cap = capDisplays[selectedProduct];
    const garment = apparelDisplays[selectedProduct];
    const mobile = width <= 700;
    const { position, focus, offset, currentOffset } = shot;
    offset.set(0, 0, 0);
    let zoom = 1;

    if (display || cap || garment) {
      const fitWidth = mobile ? width * 0.86 : width * 0.88 - 340;
      const halfFov = MathUtils.degToRad(camera.fov / 2);
      const radius = garment ? 1.29 : cap ? (mobile ? 0.76 : 0.64) : 1.16;
      const distance = Math.max(garment ? 5.45 : cap ? 2.5 : 3.85, radius * height / (fitWidth * Math.tan(halfFov)));
      if (garment) {
        const [x, , z] = apparelDisplayPosition;
        focus.set(x + 0.15, 2.16, z - garment.x);
        position.set(focus.x + distance * 0.98, focus.y + distance * 0.08, focus.z + 0.14);
      } else if (cap) {
        const [x, , z] = capDisplayPosition;
        focus.set(x - 0.74, cap.shelf + 0.33, z + cap.x);
        position.set(focus.x - distance * 0.96, focus.y + distance * 0.27, focus.z + 0.18);
      } else {
        const [x, , z] = display.position;
        focus.set(x, display.height + 0.41, z);
        position.set(x + 0.28, focus.y + distance * 0.42, z + distance * 0.91);
      }
      // Shift the optical center into the space beside or above the product panel.
      if (mobile) offset.y = height * 0.21;
      else offset.x = (340 + width * 0.06) / 2;
    } else if (entered) {
      position.set(...showroomCenter);
      if (zone === 'caps' || zone === 'apparel') {
        // The two side walls are perpendicular to the sneaker wall.
        const target = zone === 'caps' ? capDisplayPosition : apparelDisplayPosition;
        focus.set(target[0], 2.02, target[2]);
        zoom = Math.min(0.92, aspect * (zone === 'caps' ? 1.22 : 0.80));
      } else {
        focus.set(0, 1.35, -2.35);
        zoom = Math.min(1, aspect * 0.83);
      }
    } else {
      const depth = Math.max(8, 6.8 / aspect - 1.7);
      position.set(0, 3.2, depth);
      focus.set(mobile ? 0 : -0.7, 1.7, -2.35);
    }

    const dx = position.x - focus.x;
    const dz = position.z - focus.z;
    const yaw = Math.atan2(dx, dz);
    const pitch = Math.atan2(focus.y - position.y, Math.hypot(dx, dz));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const atTarget = camera.position.distanceToSquared(position) < 0.000025 &&
      Math.abs(shot.yaw - yaw) < 0.001 && Math.abs(shot.pitch - pitch) < 0.001 &&
      Math.abs(shot.zoom - zoom) < 0.001 &&
      currentOffset.distanceToSquared(offset) < 0.25;
    const settle = reducedMotion || atTarget || !shot.initialized;
    // With on-demand rendering, the first frame after an idle period can have a large delta.
    const step = Math.min(delta, shot.inMotion ? 0.1 : 1 / 60);
    const blend = settle ? 1 : MathUtils.damp(0, 1, 7, step);
    shot.inMotion = !settle;
    shot.initialized = true;
    camera.position.lerp(position, blend);
    // Interpolate yaw so crossing from either side passes through the front.
    shot.yaw = MathUtils.lerp(shot.yaw, yaw, blend);
    shot.pitch = MathUtils.lerp(shot.pitch, pitch, blend);
    shot.zoom = MathUtils.lerp(shot.zoom, zoom, blend);
    currentOffset.lerp(offset, blend);
    camera.rotation.set(shot.pitch, shot.yaw, 0, 'YXZ');
    camera.zoom = shot.zoom;
    camera.setViewOffset(width, height, currentOffset.x, currentOffset.y, width, height);

    if (!settle) invalidate();
  });

  return null;
}

export default function StoreScene({ entered, selectedProduct, onSelectProduct, zone, showProductBack }) {
  return (
    <Canvas shadows frameloop="demand" camera={{ position: [0, 3.2, 8], fov: 41 }} dpr={[1, 1.5]}>
      <CameraController entered={entered} selectedProduct={selectedProduct} zone={zone} />
      <StoreEnvironment />
      <ApparelDisplay position={apparelDisplayPosition} selectedProduct={selectedProduct} showBack={showProductBack}
        onSelectProduct={entered && zone === 'apparel' ? onSelectProduct : undefined} />
      <Suspense fallback={null}>
        <CapDisplay position={capDisplayPosition} selectedProduct={selectedProduct} showBack={showProductBack}
          onSelectProduct={entered && zone === 'caps' ? onSelectProduct : undefined} />
      </Suspense>
      {Object.keys(displays).map((productId) => (
        <ProductDisplay key={productId} productId={productId} onSelectProduct={entered && zone === 'sneakers' ? onSelectProduct : undefined} />
      ))}
    </Canvas>
  );
}
