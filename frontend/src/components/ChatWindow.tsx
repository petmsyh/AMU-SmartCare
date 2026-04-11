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
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        height: 400,
        background: '#fff',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 600,
          background: '#f8f9fa',
          borderRadius: '8px 8px 0 0',
          fontSize: 14,
        }}
      >
        💬 Consultation Chat
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#999', fontSize: 13, textAlign: 'center', margin: 'auto' }}>
            No messages yet
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isOwn ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
              }}
            >
              <div
                style={{
                  background: isOwn ? '#1a73e8' : '#f1f3f4',
                  color: isOwn ? '#fff' : '#333',
                  padding: '8px 12px',
                  borderRadius: isOwn ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  fontSize: 14,
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#999',
                  marginTop: 2,
                  textAlign: isOwn ? 'right' : 'left',
                }}
              >
                {msg.sender?.username || 'Unknown'} &bull;{' '}
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {!disabled && (
        <div
          style={{
            padding: 8,
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: 8,
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: '6px 8px',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            style={{
              background: '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '0 16px',
              cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
              opacity: sending || !text.trim() ? 0.6 : 1,
              fontSize: 14,
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
