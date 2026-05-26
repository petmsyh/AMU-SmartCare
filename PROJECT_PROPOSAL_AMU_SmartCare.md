# AMU SmartCare — Project Proposal

## Project Title
AMU SmartCare — AI-assisted Patient-Doctor Connection Platform

## Abstract
AMU SmartCare is a web platform connecting students, patients, and licensed doctors at Arba Minch University. It provides appointment booking, secure messaging, teleconsultation (WebRTC), and an AI Health Assistant for general medical information and triage guidance. The platform improves access to care, reduces administrative friction, and supports educational use-cases.

## Background & Problem Statement
Students and staff at the university currently face delays and fragmentation when seeking medical advice. Walk-in systems cause queuing and poor continuity of care. An integrated telemedicine and AI-assistant platform can provide timely guidance, reduce unnecessary in-person visits, and centralize consult records.

## Objectives
- Build a secure platform for patient–doctor interactions.
- Implement booking, consultation management, payments (mock), and ratings.
- Provide real-time audio/video consultations using WebRTC.
- Integrate an AI Health Assistant to offer general information and maintain chat sessions.
- Enforce role-based access (patient, doctor, student, admin) and data privacy.

## Scope & Key Features
- User authentication and role management.
- Patient features: find doctors, book consultations, chat history, view consultations.
- Doctor features: manage consultations, profile, wallet.
- AI Assistant: session-based chat history, persistent messages, tailored prompts for role.
- Real-time calls: WebRTC signaling, STUN/TURN support for connectivity.
- Admin: user and system management, seed test accounts.
- Secure data storage: PostgreSQL via Prisma ORM; API keys in environment variables.

## Technical Approach
- Frontend: React + TypeScript, Tailwind CSS, Redux Toolkit.
- Backend: Node.js + Express + TypeScript, Prisma ORM, PostgreSQL.
- AI: Google Generative Language API (generateContent) or configurable Genie endpoints; keys via env vars.
- Realtime: WebRTC with backend signaling and fallbacks for reliability.
- Deployment: Docker + Render (or similar). Startup runs migrations and optional seeds.
- Security: JWT authentication, bcrypt password hashing, role-based route guards.

## Data & Privacy
- Store minimal necessary PII and conversation content; obtain consent for sensitive data.
- Use HTTPS in production, strong JWT secrets, and do not commit .env files.

## Timeline (12 weeks)
- Weeks 1–2: Requirements and schema design.
- Weeks 3–4: Core backend APIs and authentication.
- Weeks 5–6: Frontend pages and routing.
- Weeks 7–8: WebRTC call integration and testing.
- Weeks 9–10: AI integration and session persistence.
- Week 11: Security testing and documentation.
- Week 12: Deployment, final report, and presentation.

## Deliverables
- Source code repository (frontend + backend).
- Deployment instructions and demo environment.
- Documentation: setup guide, API spec, and user guide.
- Final report and presentation slides.

## Success Metrics
- Functional: Core features implemented and demonstrated.
- Reliability: Stable WebRTC calls and AI responses under test load.
- Usability: Positive user testing feedback from students and doctors.
- Security: No secrets in repo; role-based access enforced.

## Risks & Mitigations
- AI key quota: keep keys as env vars, rate-limit usage, provide fallback messaging.
- WebRTC connectivity: configure STUN/TURN; provide UX guidance for failures.
- Data privacy: minimize stored PII; clear disclaimers and consent flows.

## Resources Required
- Development: Docker, Node, PostgreSQL.
- Deployment: small cloud instance or Render service for demo.
- AI API access: Google Generative API key (or equivalent).

## Conclusion
AMU SmartCare will provide a secure, extensible platform improving access to healthcare for the AMU community by combining telemedicine, an AI assistant, and robust role-based workflows.

---
Prepared by: AMU SmartCare Team
Date: May 27, 2026
