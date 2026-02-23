import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import SceneWrapper from './SceneWrapper';

const TOOLS = [
  { label: 'Search', color: '#60a5fa', position: [3, 1.5, 0] },
  { label: 'Database', color: '#a78bfa', position: [-3, 1.5, 0] },
  { label: 'Calculator', color: '#f472b6', position: [0, 1.5, 3] },
  { label: 'Code', color: '#4ade80', position: [0, 1.5, -3] },
  { label: 'API', color: '#fbbf24', position: [2.5, -1, 2.5] },
];

function AgentHub() {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={ref}>
      <Sphere args={[0.7, 32, 32]}>
        <meshStandardMaterial
          color="#0f172a"
          emissive="#60a5fa"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      <mesh>
        <torusGeometry args={[0.9, 0.02, 16, 64]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, -1.2, 0]} fontSize={0.25} color="#e2e8f0" anchorX="center">
        Agent
      </Text>
    </group>
  );
}

function ToolNode({ tool, index }) {
  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ref.current.position.y = tool.position[1] + Math.sin(time * 1.5 + index * 1.2) * 0.2;
  });

  return (
    <group ref={ref} position={tool.position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={tool.color}
          emissive={tool.color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.18}
        color={tool.color}
        anchorX="center"
      >
        {tool.label}
      </Text>
    </group>
  );
}

function DataBeam({ from, to, color, index }) {
  const particleRef = useRef();
  const t = useRef(0);

  const points = useMemo(() => {
    return [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  }, [from, to]);

  useFrame((state, delta) => {
    t.current = (t.current + delta * 0.4) % 1;
    const pos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
      (t.current + index * 0.2) % 1
    );
    if (particleRef.current) {
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.15} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function ToolUseScene() {
  return (
    <>
      <AgentHub />
      {TOOLS.map((tool, i) => (
        <group key={tool.label}>
          <ToolNode tool={tool} index={i} />
          <DataBeam from={[0, 0, 0]} to={tool.position} color={tool.color} index={i} />
        </group>
      ))}
    </>
  );
}

export default function ToolUseVisualizer() {
  return (
    <SceneWrapper cameraPosition={[4, 3, 6]}>
      <ToolUseScene />
    </SceneWrapper>
  );
}
