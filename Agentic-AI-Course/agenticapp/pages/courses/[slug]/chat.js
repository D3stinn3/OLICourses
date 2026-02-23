import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Layout from '../../../components/Layout';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { streamChat, getChatHistory } from '../../../lib/api';
import EngagementTracker from '../../../components/EngagementTracker';
import styles from '../../../styles/Chat.module.css';

export default function ChatPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);

  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!slug) return;
    getChatHistory(slug)
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [slug]);

  async function handleSend() {
    if (!input.trim() || streaming) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setStreaming(true);

    try {
      const response = await streamChat(slug, updatedMessages);

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
        ]);
        setStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE: each event is "data: <text>\n\n"
        const parts = buffer.split('\n');
        buffer = '';

        for (const line of parts) {
          if (line.startsWith('data: ')) {
            assistantContent += line.slice(6);
          } else if (line.startsWith('data:')) {
            assistantContent += line.slice(5);
          }
          // Skip empty lines (SSE delimiters)
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantContent,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Layout>
      <Head>
        <title>AI Tutor — Scwripts</title>
      </Head>

      <AuthGuard>
        {slug && <EngagementTracker courseSlug={slug} />}
        <div className={styles.container}>
          <Link href={`/courses/${slug}`} className={styles.backLink}>
            &larr; Back to Course
          </Link>

          <h2 className={styles.title}>AI Tutor</h2>

          <div className={styles.messages}>
            {messages.length === 0 && !streaming && (
              <p style={{ color: '#475569', textAlign: 'center', marginTop: '40px' }}>
                Ask anything about this course. The AI tutor is here to help.
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  msg.role === 'user' ? styles.userMsg : styles.assistantMsg
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className={styles.markdown}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {streaming && messages.length > 0 && messages[messages.length - 1].content === '' && (
              <p className={styles.thinking}>Thinking...</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={streaming}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={streaming || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </AuthGuard>
    </Layout>
  );
}
