import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import AuthGuard from '../components/AuthGuard';
import { getLeaderboard } from '../lib/api';
import styles from '../styles/Gamification.module.css';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then((data) => {
        if (Array.isArray(data)) {
          setEntries(data);
        } else if (data && Array.isArray(data.results)) {
          setEntries(data.results);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function getRankClass(rank) {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return styles.rankOther;
  }

  function getRankDisplay(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }

  return (
    <Layout>
      <Head>
        <title>Leaderboard — Scwripts</title>
      </Head>

      <AuthGuard>
        <div className={styles.leaderboardContainer}>
          <h1 className={styles.leaderboardTitle}>Weekly Leaderboard</h1>
          <p className={styles.leaderboardSubtitle}>
            Compete with fellow learners. Top performers promote to higher leagues.
          </p>

          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading rankings...</p>
          ) : entries.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>
              No entries yet this week. Start learning to claim the top spot!
            </p>
          ) : (
            <div className={styles.leaderboardList}>
              {entries.map((entry) => (
                <div key={entry.rank} className={styles.leaderboardEntry}>
                  <span className={`${styles.rank} ${getRankClass(entry.rank)}`}>
                    {getRankDisplay(entry.rank)}
                  </span>
                  <span className={styles.entryName}>{entry.username}</span>
                  <span className={styles.entryXP}>{entry.xp_earned} XP</span>
                  <span className={styles.entryLevel}>L{entry.level}</span>
                  <span className={styles.entryTier}>{entry.league_tier}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </AuthGuard>
    </Layout>
  );
}
