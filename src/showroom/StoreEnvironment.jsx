export default function StoreEnvironment() {
  return (
    <>
      {/* Iluminación general */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.5}
        castShadow
      />
      <pointLight position={[0, 3.5, -2]} intensity={35} color="#E9E0D1" />

      {/* Piso */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#37332D" roughness={0.85} />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#171715" roughness={0.9} />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 10]} />
        <meshStandardMaterial color="#37332D" roughness={0.9} />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 10]} />
        <meshStandardMaterial color="#37332D" roughness={0.9} />
      </mesh>

      {/* Vitrina central */}
      <mesh position={[0, 0.55, -2.5]} castShadow>
        <boxGeometry args={[2.8, 1.1, 1.2]} />
        <meshStandardMaterial color="#73775A" roughness={0.45} />
      </mesh>

      {/* Estantería izquierda */}
      <mesh position={[-4.5, 1.4, -3]} castShadow>
        <boxGeometry args={[0.25, 2.8, 2]} />
        <meshStandardMaterial color="#B69B78" roughness={0.6} />
      </mesh>

      {/* Estantería derecha */}
      <mesh position={[4.5, 1.4, -3]} castShadow>
        <boxGeometry args={[0.25, 2.8, 2]} />
        <meshStandardMaterial color="#B69B78" roughness={0.6} />
      </mesh>
    </>
  );
}
