
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const productPositions = {
  response: [-3, 0.355, -2],
  campus: [0, 0.355, -3],
  forum: [3, 0.355, -2]
};

function Display({ position, color = '#37332D' }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.35, 1.5]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}

function Sneaker({ position, productId, onSelectProduct }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelectProduct(productId);
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.95, 0.28, 0.42]} />
        <meshStandardMaterial color="#E9E0D1" roughness={0.5} />
      </mesh>

      <mesh position={[0.12, 0.17, 0]}>
        <boxGeometry args={[0.48, 0.22, 0.38]} />
        <meshStandardMaterial color="#B69B78" roughness={0.5} />
      </mesh>

      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[1, 0.08, 0.44]} />
        <meshStandardMaterial color="#E9E0D1" />
      </mesh>
    </group>
  );
}

function CameraController({ entered, selectedProduct }) {
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(0, 2.2, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((state, delta) => {
    let nextPosition = new THREE.Vector3(0, 2.2, 8);
    let nextLookAt = new THREE.Vector3(0, 1, 0);

    if (entered) {
      nextPosition = new THREE.Vector3(0, 2.2, 7);
    }

    if (selectedProduct) {
      const [x, y, z] = productPositions[selectedProduct];

      nextPosition = new THREE.Vector3(x, y + 1.1, z + 2.5);
      nextLookAt = new THREE.Vector3(x, y, z);
    }

    targetPosition.current.copy(nextPosition);
    targetLookAt.current.copy(nextLookAt);

    const smoothness = 1 - Math.exp(-3 * delta);

    camera.position.lerp(targetPosition.current, smoothness);

    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);

    const desiredDirection = targetLookAt.current
      .clone()
      .sub(camera.position)
      .normalize();

    currentLookAt.lerp(desiredDirection, smoothness);

    camera.lookAt(
      camera.position.clone().add(currentLookAt)
    );
  });

  return null;
}

function StoreInterior({ onSelectProduct }) {
  return (
    <>
      <color attach="background" args={['#171715']} />

      <ambientLight intensity={0.7} />

      <directionalLight
        position={[4, 8, 5]}
        intensity={2}
        castShadow
      />

      <spotLight
        position={[0, 7, 0]}
        intensity={80}
        angle={0.7}
        penumbra={1}
        color="#E9E0D1"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#37332D" roughness={0.8} />
      </mesh>

      <mesh position={[0, 3, -6]}>
        <boxGeometry args={[18, 6, 0.3]} />
        <meshStandardMaterial color="#171715" />
      </mesh>

      <mesh position={[-8, 3, 0]}>
        <boxGeometry args={[0.3, 6, 12]} />
        <meshStandardMaterial color="#24221F" />
      </mesh>

      <mesh position={[8, 3, 0]}>
        <boxGeometry args={[0.3, 6, 12]} />
        <meshStandardMaterial color="#24221F" />
      </mesh>

      <Display position={[-3, 0, -2]} />
      <Display position={[0, 0, -3]} color="#B69B78" />
      <Display position={[3, 0, -2]} />

      <Sneaker
        position={productPositions.response}
        productId="response"
        onSelectProduct={onSelectProduct}
      />

      <Sneaker
        position={productPositions.campus}
        productId="campus"
        onSelectProduct={onSelectProduct}
      />

      <Sneaker
        position={productPositions.forum}
        productId="forum"
        onSelectProduct={onSelectProduct}
      />

    </>
  );
}

export default function StoreScene({
  entered,
  selectedProduct,
  onSelectProduct
}) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 2.2, 8],
        fov: 55
      }}
      dpr={[1, 2]}
    >
      <CameraController
        entered={entered}
        selectedProduct={selectedProduct}
      />

      <StoreInterior
        onSelectProduct={onSelectProduct}
      />
    </Canvas>
  );
}
