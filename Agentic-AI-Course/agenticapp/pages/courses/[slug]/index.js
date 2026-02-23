import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { getCourse, enrollCourse } from '../../../lib/api';
import styles from '../../../styles/Courses.module.css';

export default function CourseDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollMsg, setEnrollMsg] = useState('');

  useEffect(() => {
    if (!slug) return;
    getCourse(slug)
      .then((data) => setCourse(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleEnroll() {
    try {
      await enrollCourse(slug);
      setEnrollMsg('Successfully enrolled! You can now access all course materials.');
    } catch {
      setEnrollMsg('Enrollment failed. Please try again.');
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className={styles.detail}>
          <p className={styles.loading}>Loading course...</p>
        </div>
      </Layout>
    );
  }

  if (!course || course.detail) {
    return (
      <Layout>
        <div className={styles.detail}>
          <p className={styles.empty}>Course not found.</p>
          <Link href="/courses" className={styles.backLink}>
            &larr; Back to Courses
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{course.name} — Scwripts</title>
      </Head>

      <div className={styles.detail}>
        <Link href="/courses" className={styles.backLink}>
          &larr; Back to Courses
        </Link>

        <h1 className={styles.title}>{course.name}</h1>
        <p className={styles.description}>{course.description}</p>

        {course.modules && course.modules.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Modules</h2>
            <ul className={styles.moduleList}>
              {course.modules.map((mod, index) => (
                <li key={mod.id || index} className={styles.moduleItem}>
                  <span>{mod.title}</span>
                  <div className={styles.moduleLinks}>
                    <Link href={`/courses/${slug}/slides`} className={styles.moduleLink}>
                      Slides
                    </Link>
                    <Link href={`/courses/${slug}/quiz`} className={styles.moduleLink}>
                      Quiz
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className={styles.actions}>
          <Link href={`/courses/${slug}/slides`} className={styles.actionBtn}>
            Start Slides &rarr;
          </Link>
          <Link href={`/courses/${slug}/quiz`} className={styles.actionBtnSecondary}>
            Take Quiz
          </Link>
          <Link href={`/courses/${slug}/chat`} className={styles.actionBtnSecondary}>
            AI Tutor
          </Link>
          {user && (
            <button onClick={handleEnroll} className={styles.actionBtn}>
              Enroll
            </button>
          )}
        </div>

        {enrollMsg && <p className={styles.successMsg}>{enrollMsg}</p>}
      </div>
    </Layout>
  );
}
