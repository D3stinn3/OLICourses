import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getCourses } from '../../lib/api';
import styles from '../../styles/Courses.module.css';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && Array.isArray(data.results)) {
          setCourses(data.results);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Head>
        <title>Course Catalog — Scwripts</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Course Catalog</h1>

        {loading ? (
          <p className={styles.loading}>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className={styles.empty}>No courses available yet.</p>
        ) : (
          <div className={styles.grid}>
            {courses.map((course) => (
              <div key={course.id || course.slug} className={styles.card}>
                <h3 className={styles.cardTitle}>{course.name}</h3>
                <p className={styles.cardDesc}>
                  {course.description && course.description.length > 150
                    ? course.description.slice(0, 150) + '...'
                    : course.description}
                </p>
                <Link href={`/courses/${course.slug}`} className={styles.cardLink}>
                  View Course &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
