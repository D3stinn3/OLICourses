import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/ThreeD.module.css';

const AgentReActLoop = dynamic(() => import('../components/3d/AgentReActLoop'), {
  ssr: false,
  loading: () => <div className={styles.loadingScene}>Loading 3D scene...</div>,
});

const ToolUseVisualizer = dynamic(() => import('../components/3d/ToolUseVisualizer'), {
  ssr: false,
  loading: () => <div className={styles.loadingScene}>Loading 3D scene...</div>,
});

const MultiAgentSystem = dynamic(() => import('../components/3d/MultiAgentSystem'), {
  ssr: false,
  loading: () => <div className={styles.loadingScene}>Loading 3D scene...</div>,
});

const PlanningTree = dynamic(() => import('../components/3d/PlanningTree'), {
  ssr: false,
  loading: () => <div className={styles.loadingScene}>Loading 3D scene...</div>,
});

const SCENES = [
  {
    id: 'react-loop',
    label: 'ReAct Loop',
    title: 'The ReAct Pattern — Observe, Think, Act',
    description:
      'The core reasoning loop of an AI agent. The agent observes its environment, thinks about what to do next (using an LLM), then takes an action. This cycle repeats until the task is complete. The orbiting nodes represent each phase, with data particles flowing between them.',
    component: AgentReActLoop,
  },
  {
    id: 'tool-use',
    label: 'Tool Use',
    title: 'Agent Tool Use — Extending LLM Capabilities',
    description:
      'Agents gain real-world capabilities through tools. The central agent hub dispatches requests to specialized tools — web search, databases, calculators, code interpreters, and APIs. Data beams show information flowing between the agent and its tools.',
    component: ToolUseVisualizer,
  },
  {
    id: 'multi-agent',
    label: 'Multi-Agent',
    title: 'Multi-Agent Collaboration',
    description:
      'Complex tasks require multiple specialized agents working together. A Planner decomposes goals, a Researcher gathers information, a Coder implements solutions, and a Reviewer evaluates quality. Messages arc between agents as they coordinate on shared objectives.',
    component: MultiAgentSystem,
  },
  {
    id: 'planning',
    label: 'Planning Tree',
    title: 'Hierarchical Task Planning',
    description:
      'Agents plan by decomposing high-level goals into sub-tasks, then into individual actions. This tree visualizes how a goal breaks down: Research → Search Web + Read Docs, Implement → Write Code + Test, Deploy → Build + Ship. Each node represents a step in the execution plan.',
    component: PlanningTree,
  },
];

export default function VisualizerPage() {
  const [activeScene, setActiveScene] = useState(0);
  const scene = SCENES[activeScene];
  const SceneComponent = scene.component;

  return (
    <Layout>
      <Head>
        <title>Agent Lab — Scwripts</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Agent Lab</h1>
        <p className={styles.subtitle}>
          Explore interactive 3D visualizations of agentic AI architectures. Drag to rotate, scroll to zoom.
        </p>

        <div className={styles.sceneSelector}>
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.sceneBtn} ${i === activeScene ? styles.sceneBtnActive : ''}`}
              onClick={() => setActiveScene(i)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.sceneContainer}>
          <SceneComponent />
        </div>

        <div className={styles.sceneInfo}>
          <h3 className={styles.sceneInfoTitle}>{scene.title}</h3>
          <p className={styles.sceneInfoDesc}>{scene.description}</p>
        </div>
      </div>
    </Layout>
  );
}
