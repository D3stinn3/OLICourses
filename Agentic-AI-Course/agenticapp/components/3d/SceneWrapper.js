import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function Fallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#60a5fa" wireframe />
    </mesh>
  );
}

export default function SceneWrapper({ children, cameraPosition = [0, 0, 8], fov = 50 }) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#a78bfa" />
      <Suspense fallback={<Fallback />}>
        {children}
      </Suspense>
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxDistance={15}
        minDistance={3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
