import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import AuthGuard from '../components/AuthGuard';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../lib/api';
import EngagementDashboard from '../components/EngagementDashboard';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnrollments()
      .then((data) => {
        if (Array.isArray(data)) {
          setEnrollments(data);
        } else if (data && Array.isArray(data.results)) {
          setEnrollments(data.results);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard — Scwripts</title>
      </Head>

      <AuthGuard>
        <div className={styles.container}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.welcome}>
            Welcome back{user?.username ? `, ${user.username}` : ''}!
          </p>

          {loading ? (
            <p className={styles.loading}>Loading your courses...</p>
          ) : enrollments.length === 0 ? (
            <p className={styles.empty}>
              You are not enrolled in any courses yet.{' '}
              <Link href="/courses" className={styles.emptyLink}>
                Browse courses
              </Link>
            </p>
          ) : (
            <div className={styles.grid}>
              {enrollments.map((enrollment) => {
                const course = enrollment.course || enrollment;
                const progress = enrollment.progress || 0;
                const courseSlug = course.slug || enrollment.course_slug;

                return (
                  <div key={enrollment.id || course.id} className={styles.card}>
                    <h3 className={styles.cardTitle}>{course.name || course.course_name}</h3>

                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className={styles.progressText}>{Math.round(progress)}% complete</p>

                    <Link href={`/courses/${courseSlug}`} className={styles.cardLink}>
                      Continue &rarr;
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '40px' }}>
            <h2 className={styles.title} style={{ fontSize: '1.4rem' }}>
              Engagement Analytics
            </h2>
            <EngagementDashboard
              courseSlug={
                enrollments.length > 0
                  ? (enrollments[0].course || enrollments[0]).slug ||
                    enrollments[0].course_slug
                  : null
              }
            />
          </div>
        </div>
      </AuthGuard>
    </Layout>
  );
}
