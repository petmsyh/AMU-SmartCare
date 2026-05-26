import React from 'react';
import AiChatPanel from '../../components/AiChatPanel';

const DoctorAIAssistant: React.FC = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only. It is NOT a
      substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare
      provider for medical concerns.
    </div>

    <AiChatPanel
      title="AI Health Assistant"
      subtitle="Ask clinical questions and keep each conversation in its own saved thread"
      welcomeMessage="I can provide general clinical guidance and information. For patient-specific diagnosis or urgent concerns, consult the patient's medical records and follow institutional protocols."
      placeholder="Ask a clinical question or request guidance..."
      assistantEmoji="🩺"
      suggestedPrompts={[
        'What are common causes of chest pain?',
        'Summarize current guidelines for hypertension management.',
        'How to counsel a patient with insomnia?'
      ]}
    />
  </div>
);

export default DoctorAIAssistant;
