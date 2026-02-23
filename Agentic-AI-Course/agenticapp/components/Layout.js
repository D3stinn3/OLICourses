import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import XPBar from "./XPBar";
import StreakCounter from "./StreakCounter";
import { InspectToggle } from "./InspectMode";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Scwripts
        </Link>
        <div className={styles.navLinks}>
          <Link href="/courses" className={styles.navLink}>
            Courses
          </Link>
          <Link href="/visualizer" className={styles.navLink}>
            Agent Lab
          </Link>
          {user ? (
            <>
              <XPBar />
              <StreakCounter />
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/leaderboard" className={styles.navLink}>
                Leaderboard
              </Link>
              <Link href="/my-agent" className={styles.navLink}>
                My Agent
              </Link>
              <InspectToggle />
              <button onClick={logout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.navLink}>
              Login
            </Link>
          )}
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Scwripts &mdash; Education Powered by Agents
      </footer>
    </>
  );
}
