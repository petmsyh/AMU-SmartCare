import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StudentDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = React.useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([
    {
      role: 'assistant',
      content:
        "Hello! I'm your academic health assistant. I can help you with medical studies, anatomy, pharmacology, and more. What would you like to learn today?",
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
      default:
        "That's a great question for your studies! As a medical student, understanding the pathophysiology is key. I recommend reviewing Harrison's Principles of Internal Medicine for detailed clinical correlations.",
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
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 to-purple-700 px-7 py-8 text-white">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/[0.07]" />
        <div className="relative">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest opacity-75">
            Student Portal
          </div>
          <h1 className="mb-1.5 text-3xl font-extrabold">
            Welcome, {user?.username}! ��
          </h1>
          <p className="m-0 text-sm opacity-85">
            Academic Health Assistant — For Medical Students
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr] items-start gap-5">
        {/* Topics sidebar */}
        <div className="card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-gray-900">
            �� Study Topics
          </h3>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setInput(`Tell me about ${topic.slice(2)}`)}
              className="mb-1.5 block w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-primary-50"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Chat panel */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2.5 bg-gradient-to-br from-primary-900 to-purple-700 px-5 py-3.5">
            <span className="text-xl">🤖</span>
            <div>
              <div className="text-sm font-bold text-white">
                AI Academic Assistant
              </div>
              <div className="text-xs text-white/75">
                Powered by AMU SmartCare
              </div>
            </div>
          </div>
          <div className="flex h-96 flex-col gap-2.5 overflow-y-auto bg-gray-50/60 p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
              >
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-t-2xl rounded-bl-2xl rounded-br-none bg-gradient-to-br from-primary-900 to-purple-700 text-white'
                      : 'rounded-t-2xl rounded-bl-none rounded-br-2xl bg-white text-gray-700'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="self-start">
                <div className="rounded-t-2xl rounded-bl-none rounded-br-2xl bg-white px-3.5 py-2.5 text-sm text-gray-400 shadow-sm">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2 border-t border-gray-100 bg-white p-3.5">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a medical/academic question…"
              rows={2}
              className="form-input flex-1 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="btn-primary px-5 font-bold disabled:cursor-not-allowed disabled:opacity-50"
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
