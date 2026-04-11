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
    <div className="max-w-[680px]">
      <h2 className="mb-2 text-[22px] font-semibold">🤖 AI Health Assistant</h2>
      <div className="bg-yellow-50 border border-yellow-400 rounded-md px-3.5 py-2.5 mb-4 text-[13px] text-yellow-800">
        ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only. It is NOT a
        substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare
        provider for medical concerns.
      </div>

      <div className="bg-white border border-gray-200 rounded-xl flex flex-col h-[480px] shadow-card">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              <div
                className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words
                  ${msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-[12px_12px_0_12px]'
                    : 'bg-gray-100 text-gray-800 rounded-[12px_12px_12px_0]'
                  }`}
              >
                {msg.content}
              </div>
              <div className={`text-[11px] text-gray-400 mt-0.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? 'You' : '🤖 AI Assistant'}
              </div>
            </div>
          ))}
          {loading && (
            <div className="self-start">
              <div className="bg-gray-100 px-3.5 py-2.5 rounded-[12px_12px_12px_0] text-sm text-gray-500">
                Thinking…
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-gray-200 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a health question… (Enter to send)"
            rows={2}
            className="flex-1 resize-none border border-gray-300 rounded px-2.5 py-2 text-[13px] font-[inherit]"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`btn btn-primary px-4 text-sm font-semibold ${loading || !input.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
