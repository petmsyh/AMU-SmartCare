import React from 'react';
import AiChatPanel from '../../components/AiChatPanel';

const AIAssistant: React.FC = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only. It is NOT a
      substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare
      provider for medical concerns.
    </div>

    <AiChatPanel
      title="AI Health Assistant"
      subtitle="Ask health questions and keep each conversation in its own saved thread"
      welcomeMessage="I can provide general health information and guidance. For urgent symptoms or serious concerns, please contact a qualified doctor immediately."
      placeholder="Ask a health question..."
      assistantEmoji="🤖"
      suggestedPrompts={[
        'What are common flu symptoms?',
        'Explain blood pressure in simple terms.',
        'How do I manage stress and sleep better?',
      ]}
    />
  </div>
);

export default AIAssistant;
