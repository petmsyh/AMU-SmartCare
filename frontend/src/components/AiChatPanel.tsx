import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/axios';

type AiRole = 'user' | 'assistant';

interface AiMessage {
  id?: string;
  role: AiRole;
  content: string;
  createdAt?: string;
}

interface AiSessionSummary {
  id: string;
  title: string;
  messageCount?: number;
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AiChatPanelProps {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  placeholder: string;
  assistantEmoji?: string;
  suggestedPrompts?: string[];
}

const AiChatPanel: React.FC<AiChatPanelProps> = ({
  title,
  subtitle,
  welcomeMessage,
  placeholder,
  assistantEmoji = '🤖',
  suggestedPrompts = [],
}) => {
  const genericTitles = new Set(['new chat']);
  const [sessions, setSessions] = useState<AiSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  function formatSessionTitle(session: AiSessionSummary): string {
    const title = session.title.trim();
    if (title && !genericTitles.has(title.toLowerCase())) {
      return title;
    }

    const preview = (session.lastMessagePreview || '').trim().replace(/\s+/g, ' ');
    if (!preview) {
      return 'Untitled chat';
    }

    return preview.length > 42 ? `${preview.slice(0, 42)}…` : preview;
  }

  const recents = sessions;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const loadSessions = async () => {
      setSessionsLoading(true);
      setSessionsError('');

      try {
        const res = await api.get('/ai/sessions');
        const list: AiSessionSummary[] = res.data?.data || [];

        if (list.length > 0) {
          setSessions(list);
          setSelectedSessionId((current) => current || list[0].id);
          return;
        }

        const created = await api.post('/ai/sessions', { title: 'New chat' });
        const session: AiSessionSummary = created.data?.data;
        setSessions([session]);
        setSelectedSessionId(session.id);
      } catch (err: any) {
        console.error('Failed to load AI sessions', err);
        setSessionsError(err?.response?.data?.error || err?.message || 'Failed to load chat history.');
      } finally {
        setSessionsLoading(false);
      }
    };

    void loadSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await api.get(`/ai/sessions/${selectedSessionId}/messages`);
        const history: AiMessage[] = res.data?.data || [];
        setMessages(history);
      } catch (err: any) {
        console.error('Failed to load AI session messages', err);
        setMessages([]);
      }
    };

    void loadMessages();
  }, [selectedSessionId]);

  const refreshSessions = async (preferredSessionId?: string) => {
    try {
      const res = await api.get('/ai/sessions');
      const list: AiSessionSummary[] = res.data?.data || [];
      setSessions(list);
      if (preferredSessionId) {
        setSelectedSessionId(preferredSessionId);
      }
    } catch (err) {
      console.error('Failed to refresh AI sessions', err);
    }
  };

  const handleNewChat = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/sessions', { title: 'New chat' });
      const session: AiSessionSummary = res.data?.data;
      setSessions((prev) => [session, ...prev.filter((item) => item.id !== session.id)]);
      setSelectedSessionId(session.id);
      setMessages([]);
    } catch (err: any) {
      console.error('Failed to create new AI chat session', err);
      setSessionsError(err?.response?.data?.error || err?.message || 'Failed to create a new chat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (prompt?: string) => {
    const content = (prompt || input).trim();
    if (!content || loading) return;

    setLoading(true);
    setSessionsError('');

    const sessionId = selectedSessionId;
    const userMessage: AiMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await api.post('/ai/chat', {
        message: content,
        sessionId: sessionId || undefined,
      });

      const responseSessionId = res.data?.data?.sessionId || sessionId;
      if (responseSessionId && responseSessionId !== selectedSessionId) {
        setSelectedSessionId(responseSessionId);
      }

      const reply = res.data?.data?.reply || res.data?.reply || res.data?.message || 'No response';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      if (responseSessionId) {
        await refreshSessions(responseSessionId);
        const historyRes = await api.get(`/ai/sessions/${responseSessionId}/messages`);
        setMessages(historyRes.data?.data || []);
      }
    } catch (err: any) {
      console.error('AI chat error', err);
      const serverMsg = err?.response?.data?.error || err?.message;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: serverMsg || "Sorry, I'm unable to respond right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const selectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  return (
    <div className="flex min-h-[78vh] overflow-hidden rounded-3xl border border-gray-200 bg-white text-gray-900 shadow-2xl">
      {sidebarOpen ? (
        <aside className="flex w-[300px] flex-col border-r border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-lg text-primary-600">
                {assistantEmoji}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">AMU SmartCare</div>
              </div>
            </div>
            <div>
              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse history"
                className="rounded-md border border-transparent bg-white px-2 py-1 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
              >
                ◀
              </button>
            </div>
          </div>

          <div className="px-3 pb-2">
            <button
              onClick={() => void handleNewChat()}
              disabled={loading}
              className="flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-base">＋</span>
              <span>New chat</span>
            </button>
          </div>

          <div className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
            Recents
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {sessionsLoading && <div className="px-3 py-2 text-sm text-gray-500">Loading chats…</div>}
            {sessionsError && <div className="px-3 py-2 text-sm text-red-600">{sessionsError}</div>}
            {!sessionsLoading && recents.length === 0 && !sessionsError && (
              <div className="px-3 py-2 text-sm text-gray-500">No saved chats yet.</div>
            )}
            {recents.map((session) => {
              const isActive = selectedSessionId === session.id;
              return (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                    isActive
                      ? 'border-gray-200 bg-white text-gray-900 shadow-sm'
                      : 'border-transparent bg-transparent text-gray-700 hover:bg-white'
                  }`}
                >
                  <div className="truncate text-sm font-medium">{formatSessionTitle(session)}</div>
                </button>
              );
            })}
          </div>
        </aside>
      ) : (
        <div className="flex flex-col items-center justify-start w-10 border-r border-gray-200 bg-gray-50">
          <button
            onClick={() => setSidebarOpen(true)}
            title="Open history"
            className="mt-3 rounded-md border border-transparent bg-white px-2 py-2 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
          >
            ▶
          </button>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold text-gray-900">{title}</div>
            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-500 shadow-sm">
              ▾
            </span>
          </div>
          <div className="flex items-center gap-3">
            {selectedSession && (
              <div className="max-w-[240px] truncate rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
                {formatSessionTitle(selectedSession)}
              </div>
            )}
            {/* Free offer removed */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {!selectedSessionId || messages.length === 0 ? (
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 text-4xl font-medium tracking-tight text-gray-900 md:text-5xl">
                How can I assist you today?
              </div>

              <div className="flex w-full max-w-3xl items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-4 shadow-xl">
                <span className="text-xl text-gray-500">＋</span>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  rows={1}
                  className="min-h-[28px] flex-1 resize-none border-0 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ⌁
                </button>
              </div>

              {suggestedPrompts.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void handleSend(prompt)}
                      disabled={loading}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 shadow-sm">
                {welcomeMessage}
              </div>

              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div key={`${message.role}-${message.createdAt || index}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                        isUser
                          ? 'rounded-br-md bg-primary-600 text-white'
                          : 'rounded-bl-md bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-3xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm text-gray-500 shadow-lg">
                    Thinking…
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-6 py-5">
            {suggestedPrompts.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void handleSend(prompt)}
                    disabled={loading}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end gap-3 rounded-[28px] border border-gray-200 bg-white px-4 py-3 shadow-2xl">
              <button
                onClick={() => void handleNewChat()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-lg text-gray-700 hover:bg-gray-100"
                title="New chat"
              >
                ＋
              </button>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="min-h-[42px] flex-1 resize-none border-0 bg-transparent px-1 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
              <button
                onClick={() => void handleSend()}
                disabled={loading || !input.trim()}
                className="h-11 rounded-full bg-primary-600 px-5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>

            <div className="mt-2 text-center text-[11px] text-gray-500">{subtitle}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiChatPanel;