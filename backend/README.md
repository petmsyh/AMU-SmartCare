# AMU SmartCare — Backend

This folder contains the backend API for AMU SmartCare (Node.js + TypeScript + Express + Prisma).

## Requirements
- Node 18+
- PostgreSQL
- pnpm / npm

## Setup (local)
1. Copy `.env.example` to `.env` and fill values (do NOT commit `.env`).
2. Install dependencies:

```bash
cd backend
npm install
```

3. Set environment variables (important ones):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — strong secret for JWTs
- `PORT` — server port (default 5000)
- `NODE_ENV` — `development` or `production`
- `GENIE_API_KEY` / `GEMNI_API_KEY` / `GEMNIE_API_KEY` — Google Generative API key (optional, required for AI)

4. Run database migrations and seed (local):

```bash
npm run db:migrate:deploy
npm run db:seed
```

There is a helper script `npm run db:setup` that runs migrations and seed.

## Scripts
- `npm run dev` — start dev server with ts-node / nodemon
- `npm run build` — compile TypeScript
- `npm start` — run compiled output (used in production)
- `npm run db:setup` — run migrations and seed (safe to call on container start)

## AI (Gemini / Google Generative)
The backend detects `GENIE_API_KEY`, `GEMNI_API_KEY`, or `GEMNIE_API_KEY` in the environment. Configure the key in your host (Render, Docker env, etc.) as a secret — do not store it in Git. Example usage in Render: add `GENIE_API_KEY` under Environment → Environment Variables and redeploy.

## Docker
- Build image: `docker build -t amu-smartcare-backend .`
- Run with env vars or docker-compose. Make sure migrations run before server starts (use `npm run db:setup`).

## Deploy notes (Render)
- Add environment variables in the service settings (DATABASE_URL, JWT_SECRET, GENIE_API_KEY).
- Ensure the start command runs `npm run db:setup && npm start` (or equivalent) so migrations are applied on boot.

## Troubleshooting
- "Table not found" after deploy: ensure migrations were applied to the production DB (run `prisma migrate deploy`).
- AI key errors: verify `GENIE_API_KEY` is set and valid, and that billing/quota is enabled for the project.

## Code pointers
- Main server: `src/index.ts` / `src/app.ts`
- AI controller: `src/controllers/ai.controller.ts`
- Prisma schema: `prisma/schema.prisma`
