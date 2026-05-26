# AMU SmartCare — Frontend

This folder contains the React TypeScript frontend for AMU SmartCare (CRA + Tailwind CSS).

## Requirements
- Node 16+ (recommended 18+)
- npm

## Setup (local)
```bash
cd frontend
npm install
```

## Environment
- Copy `.env.example` to `.env` and set `REACT_APP_API_URL` to your backend base URL (e.g. `http://localhost:5000/api`).

## Development
- Start dev server:
```bash
npm start
```

## Build / Deploy
- Build production bundle:
```bash
npm run build
```
- The build output is in `build/`. Serve with a static server or deploy to Render / Netlify / static host.

## Important Files
- AI chat UI: `src/components/AiChatPanel.tsx`
- Pages: `src/pages/patient/AIAssistant.tsx`, `src/pages/doctor/AIAssistant.tsx`
- API helper: `src/api/axios.ts` (set base URL via `REACT_APP_API_URL`)

## Composer behavior
- The top prompt is shown in the empty state; once a session has messages, the bottom composer will be visible for ongoing chat.

## Deploy notes (Render)
- Set environment variable `REACT_APP_API_URL` in the Render service settings before building, then trigger a deploy.

## Troubleshooting
- If the frontend calls the wrong backend host in production, confirm `REACT_APP_API_URL` in the environment of the render/static site and rebuild.
