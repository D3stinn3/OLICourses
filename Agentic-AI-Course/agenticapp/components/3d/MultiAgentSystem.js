import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import SceneWrapper from './SceneWrapper';

const AGENTS = [
  { label: 'Planner', color: '#60a5fa', basePos: [0, 2, 0], role: 'Decomposes goals into tasks' },
  { label: 'Researcher', color: '#a78bfa', basePos: [-2.5, 0, 1.5], role: 'Gathers information' },
  { label: 'Coder', color: '#4ade80', basePos: [2.5, 0, 1.5], role: 'Writes & reviews code' },
  { label: 'Reviewer', color: '#f472b6', basePos: [0, -1.5, -2], role: 'Evaluates quality' },
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3],
  [1, 2], [2, 3], [1, 3],
];

function AgentNode({ agent, index }) {
  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const [bx, by, bz] = agent.basePos;
    ref.current.position.set(
      bx + Math.sin(time * 0.7 + index * 2) * 0.3,
      by + Math.sin(time * 0.5 + index * 1.5) * 0.2,
      bz + Math.cos(time * 0.6 + index * 1.8) * 0.3
    );
    ref.current.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.05);
  });

  return (
    <group ref={ref} position={agent.basePos}>
      <Sphere args={[0.45, 24, 24]}>
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </Sphere>
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.2}
        color={agent.color}
        anchorX="center"
        fontWeight="bold"
      >
        {agent.label}
      </Text>
    </group>
  );
}

function MessageArc({ fromAgent, toAgent, index }) {
  const particleRef = useRef();
  const t = useRef(Math.random());

  useFrame((state, delta) => {
    t.current = (t.current + delta * 0.3) % 1;
    const from = new THREE.Vector3(...fromAgent.basePos);
    const to = new THREE.Vector3(...toAgent.basePos);
    const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
    mid.y += 1.2;

    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const point = curve.getPoint(t.current);

    if (particleRef.current) {
      particleRef.current.position.copy(point);
    }
  });

  const curvePoints = useMemo(() => {
    const from = new THREE.Vector3(...fromAgent.basePos);
    const to = new THREE.Vector3(...toAgent.basePos);
    const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
    mid.y += 1.2;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return curve.getPoints(30);
  }, [fromAgent.basePos, toAgent.basePos]);

  return (
    <group>
      <Line points={curvePoints} color="#475569" lineWidth={0.5} transparent opacity={0.2} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={fromAgent.color}
          emissive={fromAgent.color}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function MultiAgentScene() {
  return (
    <>
      {AGENTS.map((agent, i) => (
        <AgentNode key={agent.label} agent={agent} index={i} />
      ))}
      {CONNECTIONS.map(([from, to], i) => (
        <MessageArc
          key={`${from}-${to}`}
          fromAgent={AGENTS[from]}
          toAgent={AGENTS[to]}
          index={i}
        />
      ))}
    </>
  );
}

export default function MultiAgentSystem() {
  return (
    <SceneWrapper cameraPosition={[0, 2, 7]}>
      <MultiAgentScene />
    </SceneWrapper>
  );
}
