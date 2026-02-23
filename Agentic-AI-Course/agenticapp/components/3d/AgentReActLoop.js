import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import SceneWrapper from './SceneWrapper';

const PHASES = [
  { label: 'Observe', color: '#60a5fa', emoji: '👁️', angle: 0 },
  { label: 'Think', color: '#a78bfa', emoji: '🧠', angle: (2 * Math.PI) / 3 },
  { label: 'Act', color: '#f472b6', emoji: '⚡', angle: (4 * Math.PI) / 3 },
];

function CentralAgent() {
  const ref = useRef();

  useFrame((state) => {
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
  });

  return (
    <group ref={ref}>
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#1e293b"
          emissive="#60a5fa"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      <Text
        position={[0, -1, 0]}
        fontSize={0.25}
        color="#e2e8f0"
        anchorX="center"
        anchorY="top"
      >
        Agent
      </Text>
    </group>
  );
}

function OrbitingNode({ phase, index, activePhase }) {
  const groupRef = useRef();
  const radius = 2.8;
  const isActive = activePhase === index;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const angle = phase.angle + time * 0.3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    groupRef.current.position.set(x, Math.sin(time + index) * 0.3, z);
    const scale = isActive ? 1.3 : 1;
    groupRef.current.scale.setScalar(scale + Math.sin(time * 3 + index) * 0.05);
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.35, 24, 24]}>
        <meshStandardMaterial
          color={phase.color}
          emissive={phase.color}
          emissiveIntensity={isActive ? 0.6 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </Sphere>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.2}
        color={phase.color}
        anchorX="center"
      >
        {phase.label}
      </Text>
    </group>
  );
}

function ConnectionRing() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8));
    }
    return pts;
  }, []);

  return (
    <Line
      points={points}
      color="#60a5fa"
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

function Particles() {
  const ref = useRef();
  const count = 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 0.6;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const posArr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time * 0.5;
      const r = 2.5 + Math.sin(time * 2 + i) * 0.3;
      posArr[i * 3] = Math.cos(angle) * r;
      posArr[i * 3 + 1] = Math.sin(time * 3 + i * 0.5) * 0.3;
      posArr[i * 3 + 2] = Math.sin(angle) * r;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#a78bfa" transparent opacity={0.6} />
    </points>
  );
}

function ReActScene() {
  const activeRef = useRef(0);

  useFrame((state) => {
    activeRef.current = Math.floor(state.clock.elapsedTime / 2) % 3;
  });

  return (
    <>
      <CentralAgent />
      {PHASES.map((phase, i) => (
        <OrbitingNode key={phase.label} phase={phase} index={i} activePhase={activeRef.current} />
      ))}
      <ConnectionRing />
      <Particles />
    </>
  );
}

export default function AgentReActLoop() {
  return (
    <SceneWrapper cameraPosition={[0, 3, 6]}>
      <ReActScene />
    </SceneWrapper>
  );
}
