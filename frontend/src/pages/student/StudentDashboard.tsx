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

  const topics = [
    '🫀 Cardiology',
    '🧠 Neurology',
    '💊 Pharmacology',
    '🔬 Pathology',
    '🦠 Microbiology',
    '🩺 Clinical Skills',
    '📊 Biostatistics',
    '🏥 Surgery',
  ];

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d47a1 0%, #7b1fa2 100%)',
          borderRadius: 16,
          padding: '32px 28px',
          color: '#fff',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>
            Student Portal
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800 }}>
            Welcome, {user?.username}! 🎓
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>
            Academic Health Assistant — For Medical Students
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, alignItems: 'start' }}>
        {/* Topics sidebar */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 14,
            padding: 20,
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>📚 Study Topics</h3>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setInput(`Tell me about ${topic.slice(2)}`)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '9px 12px',
                border: '1px solid #eee',
                borderRadius: 8,
                cursor: 'pointer',
                marginBottom: 6,
                fontSize: 13,
                background: '#f8f9fa',
                color: '#333',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#e8f0fe'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8f9fa'; }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Chat panel */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #0d47a1, #7b1fa2)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>AI Academic Assistant</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Powered by AMU SmartCare</div>
            </div>
          </div>
          <div
            style={{
              height: 380,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#fafbfc',
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
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #0d47a1, #7b1fa2)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 0 14px' : '14px 14px 14px 0',
                    fontSize: 13,
                    lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '14px 14px 14px 0', fontSize: 13, color: '#888', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '12px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8, background: '#fff' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a medical/academic question…"
              rows={2}
              style={{ flex: 1, resize: 'none', border: '1.5px solid #e8e8e8', borderRadius: 8, padding: '8px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '0 18px',
                background: loading || !input.trim() ? '#ccc' : 'linear-gradient(135deg, #0d47a1, #7b1fa2)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 700,
              }}
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
