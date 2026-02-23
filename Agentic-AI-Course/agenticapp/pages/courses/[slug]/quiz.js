import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { getCourse, getQuiz, submitQuiz } from '../../../lib/api';
import { useToast } from '../../../components/AchievementToast';
import styles from '../../../styles/Quiz.module.css';

export default function QuizPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showXP, showAchievement, showLevelUp } = useToast();

  useEffect(() => {
    if (!slug) return;

    async function loadQuiz() {
      try {
        const course = await getCourse(slug);
        const modules = course.modules || [];
        if (modules.length > 0) {
          const firstModuleId = modules[0].id;
          const quizData = await getQuiz(firstModuleId);
          setQuiz(quizData);
        }
      } catch {
        // Quiz not available
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [slug]);

  function handleAnswer(questionId, choiceIndex) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceIndex,
    }));
  }

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);

    try {
      const answersArray = (quiz.questions || []).map((q) => {
        const choiceIndex = answers[q.id];
        const choices = q.choices || [];
        const choice = choiceIndex !== undefined ? choices[choiceIndex] : null;
        return {
          question_id: q.id,
          choice_id: choice ? choice.id : 0,
        };
      });

      const data = await submitQuiz(quiz.id, answersArray);
      setResult(data);

      // Show XP toast if XP was awarded
      if (data.xp) {
        showXP(data.xp.xp_awarded, `Quiz score: ${Math.round(data.score)}%`);
        if (data.xp.leveled_up) {
          showLevelUp(data.xp.level, data.xp.title);
        }
        if (data.xp.new_achievements) {
          data.xp.new_achievements.forEach((a) => showAchievement(a));
        }
        // Tell XPBar to refresh
        window.dispatchEvent(new Event('xp-changed'));
      }
    } catch {
      // Submit failed
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Quiz — Scwripts</title>
      </Head>

      <AuthGuard>
        <div className={styles.container}>
          <Link href={`/courses/${slug}`} className={styles.backLink}>
            &larr; Back to Course
          </Link>

          {loading ? (
            <p className={styles.loading}>Loading quiz...</p>
          ) : !quiz ? (
            <p className={styles.loading}>No quiz available for this course yet.</p>
          ) : (
            <>
              <h2 className={styles.title}>{quiz.title || 'Quiz'}</h2>

              {!result ? (
                <>
                  {(quiz.questions || []).map((question, qIndex) => (
                    <div key={question.id || qIndex} className={styles.question}>
                      <p className={styles.questionText}>
                        {qIndex + 1}. {question.text}
                      </p>
                      <ul className={styles.choices}>
                        {(question.choices || []).map((choice, cIndex) => (
                          <li key={cIndex}>
                            <label className={styles.choice}>
                              <input
                                type="radio"
                                name={`question-${question.id || qIndex}`}
                                checked={answers[question.id] === cIndex}
                                onChange={() => handleAnswer(question.id, cIndex)}
                              />
                              {typeof choice === 'string' ? choice : choice.text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                </>
              ) : (
                <div className={styles.result}>
                  <p className={styles.score}>
                    {result.score !== undefined
                      ? `${Math.round(result.score)}%`
                      : result.correct !== undefined
                        ? `${Math.round((result.correct / result.total) * 100)}%`
                        : 'Submitted'}
                  </p>
                  {result.correct !== undefined && result.total !== undefined && (
                    <p className={styles.scoreDetail}>
                      {result.correct} / {result.total} correct
                    </p>
                  )}

                  {result.feedback && (
                    <ul className={styles.feedback}>
                      {result.feedback.map((item, index) => (
                        <li key={index} className={styles.feedbackItem}>
                          <span className={item.is_correct ? styles.correct : styles.wrong}>
                            {item.is_correct ? 'Correct' : 'Wrong'}
                          </span>
                          {' — '}
                          <span style={{ color: '#e0e0e0' }}>{item.question_text || `Question ${index + 1}`}</span>
                          {item.explanation && (
                            <p className={styles.explanation}>{item.explanation}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </AuthGuard>
    </Layout>
  );
}
