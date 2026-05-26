import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AiChatPanel from '../../components/AiChatPanel';

const StudentDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 to-purple-700 px-7 py-8 text-white">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/[0.07]" />
        <div className="relative">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest opacity-75">
            Student Portal
          </div>
          <h1 className="mb-1.5 text-3xl font-extrabold">Welcome, {user?.username}!</h1>
          <p className="m-0 text-sm opacity-85">
            Academic Health Assistant for course questions, revision, and clinical reasoning practice.
          </p>
        </div>
      </div>

      <AiChatPanel
        title="AI Academic Assistant"
        subtitle="Keep each study conversation saved and come back to it later"
        welcomeMessage="Use this assistant to revise anatomy, pharmacology, pathology, clinical skills, and other course topics. When you ask follow-up questions in the same chat, the assistant will remember the earlier context."
        placeholder="Ask a medical/academic question..."
        assistantEmoji="🎓"
        suggestedPrompts={[
          'Explain the cardiac cycle in simple terms.',
          'Summarize common antibiotic classes.',
          'Help me revise patient history taking.',
        ]}
      />
    </div>
  );
};

export default StudentDashboard;
