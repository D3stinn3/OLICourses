import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Scwripts — Education Powered by Agents</title>
        <meta
          name="description"
          content="The next education platform powered by AI agents. Learn Agentic AI through hands-on labs and real projects."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.logo}>Scwripts</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/courses" className={styles.navLink}>
            Courses
          </Link>
          <Link href="/login" className={styles.navLink}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>OLI-AAI-101</span>
        <h1 className={styles.heroTitle}>Learn Agentic AI</h1>
        <p className={styles.heroSub}>
          Build autonomous intelligent systems. Scwripts brings you hands-on,
          agent-powered education — from first principles to real-world
          multi-agent projects.
        </p>
        <Link href="/courses" className={styles.cta}>
          Browse Courses
        </Link>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>What you will learn</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>&#x1F9E0;</span>
            <h3 className={styles.cardTitle}>Agent-Powered Learning</h3>
            <p className={styles.cardDesc}>
              Understand how LLMs reason, plan, and act — the core of every
              modern AI agent.
            </p>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>&#x1F6E0;&#xFE0F;</span>
            <h3 className={styles.cardTitle}>Hands-On Labs</h3>
            <p className={styles.cardDesc}>
              Build ReAct agents, tool-augmented bots, and memory-enabled
              systems from scratch.
            </p>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>&#x1F91D;</span>
            <h3 className={styles.cardTitle}>Multi-Agent Projects</h3>
            <p className={styles.cardDesc}>
              Design teams of specialized agents that research, write, review,
              and deploy together.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        Scwripts &mdash; Education Powered by Agents
      </footer>
    </>
  );
}
