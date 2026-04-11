import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchMessages, sendMessage } from '../store/slices/consultationsSlice';

interface ChatWindowProps {
  consultationId: string;
  disabled?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ consultationId, disabled = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.consultations);
  const { user } = useSelector((state: RootState) => state.auth);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchMessages(consultationId));
    const interval = setInterval(() => {
      dispatch(fetchMessages(consultationId));
    }, 5000);
    return () => clearInterval(interval);
  }, [consultationId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await dispatch(sendMessage({ consultationId, content: text.trim() }));
    setText('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg flex flex-col h-[400px] bg-white">
      <div className="px-3 py-2 border-b border-gray-200 font-semibold bg-gray-50 rounded-t-lg text-sm">
        💬 Consultation Chat
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-[13px] text-center m-auto">
            No messages yet
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={`max-w-[70%] ${isOwn ? 'self-end' : 'self-start'}`}
            >
              <div
                className={`px-3 py-2 text-sm break-words
                  ${isOwn
                    ? 'bg-primary-500 text-white rounded-[12px_12px_0_12px]'
                    : 'bg-gray-100 text-gray-800 rounded-[12px_12px_12px_0]'
                  }`}
              >
                {msg.content}
              </div>
              <div className={`text-[11px] text-gray-400 mt-0.5 ${isOwn ? 'text-right' : 'text-left'}`}>
                {msg.sender?.username || 'Unknown'} &bull;{' '}
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {!disabled && (
        <div className="p-2 border-t border-gray-200 flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={2}
            className="flex-1 resize-none border border-gray-300 rounded px-2 py-1.5 text-[13px] font-[inherit]"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className={`btn btn-primary px-4 text-sm ${sending || !text.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
