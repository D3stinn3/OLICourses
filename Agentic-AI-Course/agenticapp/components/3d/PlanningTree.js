import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import SceneWrapper from './SceneWrapper';

const TREE = {
  label: 'Goal',
  color: '#fbbf24',
  position: [0, 3, 0],
  children: [
    {
      label: 'Research',
      color: '#60a5fa',
      position: [-2.5, 1, 0],
      children: [
        { label: 'Search Web', color: '#93c5fd', position: [-3.5, -1, 1] },
        { label: 'Read Docs', color: '#93c5fd', position: [-1.5, -1, 1] },
      ],
    },
    {
      label: 'Implement',
      color: '#a78bfa',
      position: [0, 1, 0],
      children: [
        { label: 'Write Code', color: '#c4b5fd', position: [-0.5, -1, -1] },
        { label: 'Test', color: '#c4b5fd', position: [0.5, -1, -1] },
      ],
    },
    {
      label: 'Deploy',
      color: '#4ade80',
      position: [2.5, 1, 0],
      children: [
        { label: 'Build', color: '#86efac', position: [1.5, -1, 1] },
        { label: 'Ship', color: '#86efac', position: [3.5, -1, 1] },
      ],
    },
  ],
};

function TreeNode({ node, index = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(time * 2 + index * 0.7) * 0.06);
  });

  return (
    <group ref={ref} position={node.position}>
      <Sphere args={[0.3, 20, 20]}>
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.35}
          metalness={0.5}
          roughness={0.3}
        />
      </Sphere>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.16}
        color={node.color}
        anchorX="center"
      >
        {node.label}
      </Text>
    </group>
  );
}

function TreeEdge({ from, to, color }) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  return <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.3} />;
}

function renderTree(node, parentPos = null, index = 0) {
  const elements = [];
  elements.push(<TreeNode key={node.label} node={node} index={index} />);

  if (parentPos) {
    elements.push(
      <TreeEdge key={`edge-${node.label}`} from={parentPos} to={node.position} color={node.color} />
    );
  }

  if (node.children) {
    node.children.forEach((child, i) => {
      elements.push(...renderTree(child, node.position, index + i + 1));
    });
  }

  return elements;
}

function PlanningScene() {
  return <>{renderTree(TREE)}</>;
}

export default function PlanningTree() {
  return (
    <SceneWrapper cameraPosition={[0, 1, 8]}>
      <PlanningScene />
    </SceneWrapper>
  );
}
