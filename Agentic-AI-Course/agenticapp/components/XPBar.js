import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { getXPProfile } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Gamification.module.css';

export default function XPBar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const refresh = useCallback(() => {
    if (!user) return;
    getXPProfile()
      .then(setProfile)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Listen for XP changes from other components
  useEffect(() => {
    function onXPChange() { refresh(); }
    window.addEventListener('xp-changed', onXPChange);
    return () => window.removeEventListener('xp-changed', onXPChange);
  }, [refresh]);

  if (!user || !profile) return null;

  return (
    <motion.div
      className={styles.xpBarWrap}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className={styles.levelBadge}>L{profile.level}</span>
      <div className={styles.xpTrack}>
        <motion.div
          className={styles.xpFill}
          initial={{ width: 0 }}
          animate={{ width: `${profile.xp_progress_pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className={styles.xpText}>{profile.total_xp} XP</span>
    </motion.div>
  );
}
