import React, { useState } from 'react';
import api from '../../api/axios';

interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I\'m your AI health assistant. I can provide general health information and guidance. Please note: I am NOT a substitute for professional medical advice. For serious concerns, always consult a qualified doctor.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: AiMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userMsg.content,
        history: messages,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.reply || res.data.message || 'No response' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I\'m unable to respond right now. Please try again later or consult a doctor directly.',
        },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>🤖 AI Health Assistant</h2>
      <div
        style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 16,
          fontSize: 13,
          color: '#856404',
        }}
      >
        ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only. It is NOT a
        substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare
        provider for medical concerns.
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          height: 480,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
              }}
            >
              <div
                style={{
                  background: msg.role === 'user' ? '#1a73e8' : '#f1f3f4',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.role === 'user' ? 'You' : '🤖 AI Assistant'}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start' }}>
              <div
                style={{
                  background: '#f1f3f4',
                  padding: '10px 14px',
                  borderRadius: '12px 12px 12px 0',
                  fontSize: 14,
                  color: '#666',
                }}
              >
                Thinking…
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a health question… (Enter to send)"
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: '8px 10px',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '0 18px',
              background: '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
