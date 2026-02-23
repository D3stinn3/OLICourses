import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getXPProfile } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Gamification.module.css';

export default function StreakCounter() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user) return;
    getXPProfile()
      .then((data) => setStreak(data.current_streak || 0))
      .catch(() => {});
  }, [user]);

  if (!user || streak <= 0) return null;

  return (
    <motion.div
      className={styles.streakWrap}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <motion.span
        className={styles.streakIcon}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      >
        🔥
      </motion.span>
      {streak}
    </motion.div>
  );
}
