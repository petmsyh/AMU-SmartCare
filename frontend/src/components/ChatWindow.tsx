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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    dispatch(fetchMessages(consultationId));
    const interval = setInterval(() => {
      dispatch(fetchMessages(consultationId));
    }, 5000);
    return () => clearInterval(interval);
  }, [consultationId, dispatch]);

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

  const latestOwnMessageId = [...messages]
    .reverse()
    .find((item) => item.senderId === user?.id)?.id;

  return (
    <div className="border border-gray-200 rounded-2xl flex flex-col h-[68vh] sm:h-[440px] max-h-[760px] bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 font-semibold bg-gray-50 text-sm sticky top-0 z-10">
        💬 Consultation Chat
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center m-auto">
            No messages yet
          </p>
        )}
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === user?.id;
          const isLatestOwn = isOwn && msg.id === latestOwnMessageId;
          const isSeenByPeer = messages
            .slice(index + 1)
            .some((item) => item.senderId !== user?.id);

          return (
            <div
              key={msg.id}
              className={`max-w-[85%] sm:max-w-[72%] ${isOwn ? 'self-end' : 'self-start'}`}
            >
              <div
                className={`px-3.5 py-2 text-[14px] leading-5 break-words
                  ${isOwn
                    ? 'bg-primary-500 text-white rounded-[12px_12px_0_12px]'
                    : 'bg-gray-100 text-gray-800 rounded-[12px_12px_12px_0]'
                  }`}
              >
                {msg.content}
              </div>
              <div className={`text-[11px] text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                {msg.sender?.username || 'Unknown'} &bull;{' '}
                {new Date(msg.createdAt).toLocaleTimeString()}
                {isLatestOwn && (
                  <>
                    {' '}
                    &bull; {isSeenByPeer ? 'Seen' : 'Sent'}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!disabled && (
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-t border-gray-200 flex items-end gap-2 bg-white">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm font-[inherit] min-h-[42px] max-h-[140px]"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className={`px-4 h-[42px] rounded-xl text-sm font-semibold bg-primary-500 text-white transition-colors
              ${sending || !text.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-600'}`}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
