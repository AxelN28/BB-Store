import { Suspense } from 'react';
import AlbumWall from './AlbumWall';

const wallRibs = Array.from({ length: 15 }, (_, index) => (index - 7) * 0.65);

export default function StoreEnvironment() {
  return (
    <>
      <color attach="background" args={['#211b18']} />
      <fog attach="fog" args={['#211b18', 15, 35]} />
      <hemisphereLight args={['#fff0dc', '#45362e', 1.45]} />
      <directionalLight position={[-3, 6, 4]} color="#ffe4c6" intensity={3}
        castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0003}
        shadow-normalBias={0.025} shadow-camera-left={-5} shadow-camera-right={5} />
      <directionalLight position={[4, 5, -5]} color="#e1e7ff" intensity={1.9} />
      <pointLight position={[0, 3.9, -4.5]} color="#ffae71" intensity={48} distance={9} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial color="#302923" roughness={0.75} />
      </mesh>
      <mesh position={[0, 3.25, -6.4]} receiveShadow>
        <boxGeometry args={[21, 6.5, 0.3]} />
        <meshStandardMaterial color="#302623" roughness={0.96} />
      </mesh>
      {wallRibs.map((x) => (
        <mesh key={x} position={[x, 3.25, -6.16]}>
          <boxGeometry args={[0.08, 6.5, 0.23]} />
          <meshStandardMaterial color="#4d3a32" roughness={0.87} />
        </mesh>
      ))}
      <Suspense fallback={null}>
        <AlbumWall />
      </Suspense>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 5.05, 3, -6.01]}>
            <boxGeometry args={[0.045, 6, 0.045]} />
            <meshBasicMaterial color="#ffc78e" toneMapped={false} />
          </mesh>
          <mesh position={[side * 9.35, 3, 3.25]}>
            <boxGeometry args={[0.25, 6, 19.5]} />
            <meshStandardMaterial color="#291f1b" roughness={0.94} />
          </mesh>
          {[0.3, 2.7, 5.1, 7.7, 10.1].map((z) => (
            <mesh key={z} position={[side * 9.16, 3, z]}>
              <boxGeometry args={[0.15, 6, 0.085]} />
              <meshStandardMaterial color="#4d3a32" roughness={0.87} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}
