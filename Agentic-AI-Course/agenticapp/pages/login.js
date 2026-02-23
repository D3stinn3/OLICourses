import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await auth.login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Sign In — Scwripts</title>
      </Head>

      <div className={styles.container}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Sign In</h1>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.btn}>
            Sign In
          </button>

          <Link href="/register" className={styles.link}>
            Don&apos;t have an account? Sign up
          </Link>
        </form>
      </div>
    </>
  );
}
