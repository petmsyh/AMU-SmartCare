import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StudentDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content:
        'Hello! I\'m your academic health assistant. I can help you with medical studies, anatomy, pharmacology, and more. What would you like to learn today?',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user' as const, content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulated academic responses
    const responses: Record<string, string> = {
      default: 'That\'s a great question for your studies! As a medical student, understanding the pathophysiology is key. I recommend reviewing Harrison\'s Principles of Internal Medicine for detailed clinical correlations.',
    };
    await new Promise((r) => setTimeout(r, 800));
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant' as const,
        content: responses[input.toLowerCase()] || responses.default,
      },
    ]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #0d47a1, #1565c0)',
          borderRadius: 12,
          padding: '28px 24px',
          color: '#fff',
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: '0 0 4px', fontSize: 26 }}>
          Welcome, {user?.username}! 🎓
        </h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>
          Academic Health Assistant — For Medical Students
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, alignItems: 'start' }}>
        <div
          style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>📚 Study Topics</h3>
          {[
            '🫀 Cardiology',
            '🧠 Neurology',
            '💊 Pharmacology',
            '🔬 Pathology',
            '🦠 Microbiology',
            '🩺 Clinical Skills',
            '📊 Biostatistics',
            '🏥 Surgery',
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => setInput(`Tell me about ${topic.slice(2)}`)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                cursor: 'pointer',
                marginBottom: 6,
                fontSize: 13,
                background: '#f8f9fa',
                color: '#333',
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              background: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            🤖 AI Academic Assistant
          </div>
          <div
            style={{
              height: 380,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    background: msg.role === 'user' ? '#0d47a1' : '#f1f3f4',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    padding: '9px 12px',
                    borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ background: '#f1f3f4', padding: '9px 12px', borderRadius: '12px 12px 12px 0', fontSize: 13, color: '#666' }}>
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: 10, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a medical/academic question…"
              rows={2}
              style={{ flex: 1, resize: 'none', border: '1px solid #ddd', borderRadius: 4, padding: '7px 9px', fontSize: 13, fontFamily: 'inherit' }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ padding: '0 16px', background: '#0d47a1', color: '#fff', border: 'none', borderRadius: 4, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.6 : 1, fontSize: 13, fontWeight: 600 }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
