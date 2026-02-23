import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from '../styles/Gamification.module.css';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showAchievement = useCallback((achievement) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...achievement }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const showXP = useCallback((amount, description) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, icon: '⚡', name: `+${amount} XP`, description, xp_reward: 0 },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const showLevelUp = useCallback((level, title) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, icon: '🎉', name: `Level ${level}!`, description: title, xp_reward: 0 },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showAchievement, showXP, showLevelUp }}>
      {children}
      <div className={styles.toastOverlay}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={styles.toast}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className={styles.toastIcon}>{toast.icon}</span>
              <div className={styles.toastContent}>
                <div className={styles.toastTitle}>{toast.name}</div>
                <div className={styles.toastDesc}>{toast.description}</div>
              </div>
              {toast.xp_reward > 0 && (
                <span className={styles.toastXP}>+{toast.xp_reward} XP</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
