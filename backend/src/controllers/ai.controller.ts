import { Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../types';

type ChatRole = 'user' | 'assistant';

interface ChatHistoryEntry {
  role?: string;
  content?: string;
}

const GENIE_KEY = process.env.GENIE_API_KEY || process.env.GEMNI_API_KEY || process.env.GEMNIE_API_KEY;
const GENIE_URL = process.env.GENIE_API_URL || process.env.GEMNI_API_URL || process.env.GEMNIE_API_URL || 'https://api.genie.example/v1/chat';
const GOOGLE_MODEL = process.env.GENIE_MODEL || process.env.GEMNI_MODEL || process.env.GEMNIE_MODEL || 'gemini-2.5-flash';
const MAX_CONTEXT_MESSAGES = 16;

function createDefaultTitle(message: string): string {
  const normalized = message.trim().replace(/\s+/g, ' ');
  if (!normalized) return 'New chat';
  return normalized.length > 48 ? `${normalized.slice(0, 48)}…` : normalized;
}

function isGenericSessionTitle(title: string): boolean {
  return title.trim().toLowerCase() === 'new chat';
}

function normalizeHistoryEntry(entry: ChatHistoryEntry): { role: ChatRole; content: string } | null {
  const content = typeof entry.content === 'string' ? entry.content.trim() : '';
  if (!content) return null;

  const role = entry.role === 'assistant' ? 'assistant' : 'user';
  return { role, content };
}

function toSessionSummary(session: {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Array<{ content: string; createdAt: Date }>;
  _count: { messages: number };
}) {
  return {
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messageCount: session._count.messages,
    lastMessageAt: session.messages[0]?.createdAt ?? null,
    lastMessagePreview: session.messages[0]?.content ?? null,
  };
}

async function ensureSessionForUser(userId: string, sessionId?: string, title?: string) {
  if (sessionId) {
    const session = await prisma.aiChatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw Object.assign(new Error('AI chat session not found'), { statusCode: 404 });
    }

    return session;
  }

  return prisma.aiChatSession.create({
    data: {
      userId,
      title: title?.trim() || 'New chat',
    },
  });
}

async function getSessionWithMeta(userId: string, sessionId: string) {
  const session = await prisma.aiChatSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
  });

  if (!session) {
    throw Object.assign(new Error('AI chat session not found'), { statusCode: 404 });
  }

  return session;
}

async function getSessionMessages(userId: string, sessionId: string) {
  const session = await prisma.aiChatSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true },
  });

  if (!session) {
    throw Object.assign(new Error('AI chat session not found'), { statusCode: 404 });
  }

  return prisma.aiChatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
  });
}

async function listContextMessages(sessionId: string) {
  return prisma.aiChatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: MAX_CONTEXT_MESSAGES,
  });
}

async function seedLegacyHistory(sessionId: string, history?: ChatHistoryEntry[]) {
  const normalizedHistory = (history || []).map(normalizeHistoryEntry).filter((entry): entry is { role: ChatRole; content: string } => Boolean(entry));
  if (normalizedHistory.length === 0) return;

  const existingCount = await prisma.aiChatMessage.count({ where: { sessionId } });
  if (existingCount > 0) return;

  await prisma.aiChatMessage.createMany({
    data: normalizedHistory.map((entry) => ({
      sessionId,
      role: entry.role,
      content: entry.content,
    })),
  });
}

function buildSystemPrompt(department: string): string {
  const deptText = department && department !== 'general' ? `The user's department is ${department}.` : 'The user does not have a department-specific context.';

  return [
    'You are the AMU SmartCare AI assistant.',
    'Provide accurate, concise, and practical answers.',
    'Do not claim to replace a doctor or therapist.',
    'If the question is urgent or potentially dangerous, advise immediate professional help.',
    deptText,
  ].join(' ');
}

async function callGenie(message: string, dept: string, history: Array<{ role: ChatRole; content: string }>) {
  if (!GENIE_KEY) throw new Error('Gemini API key not configured');

  if (GENIE_URL && !GENIE_URL.includes('api.genie.example')) {
    const payload = {
      input: message,
      context: { department: dept },
      history,
    };

    const resp = await fetch(GENIE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GENIE_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Genie API error: ${resp.status} ${txt}`);
    }

    const data: any = await resp.json();
    return data?.reply || data?.output || data?.text || (data?.choices && data.choices[0]?.message?.content) || null;
  }

  if (!GENIE_KEY.startsWith('AIza')) {
    const payload = {
      input: message,
      context: { department: dept },
      history,
    };

    const resp = await fetch(GENIE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GENIE_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Genie API error: ${resp.status} ${txt}`);
    }

    const data: any = await resp.json();
    return data?.reply || data?.output || data?.text || (data?.choices && data.choices[0]?.message?.content) || null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_MODEL}:generateContent?key=${GENIE_KEY}`;
  const conversationContents = history.map((entry) => ({
    role: entry.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: entry.content }],
  }));

  const body = {
    systemInstruction: {
      parts: [{ text: buildSystemPrompt(dept) }],
    },
    contents: [
      ...conversationContents,
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
    },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Google Generative API error: ${resp.status} ${txt}`);
  }

  const data: any = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((part: any) => part?.text).filter(Boolean).join('')
    : null;

  return text || data?.candidates?.[0]?.output || data?.candidates?.[0]?.content || null;
}

export const aiController = {
  async listSessions(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const sessions = await prisma.aiChatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { messages: true },
          },
        },
      });

      res.json({ success: true, data: sessions.map(toSessionSummary) });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async createSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { title } = req.body as { title?: string };
      const session = await prisma.aiChatSession.create({
        data: {
          userId,
          title: title?.trim() || 'New chat',
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { messages: true },
          },
        },
      });

      res.status(201).json({ success: true, data: toSessionSummary(session) });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getSessionMessages(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.params;
      const messages = await getSessionMessages(userId, sessionId);
      res.json({ success: true, data: messages });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async chat(req: AuthRequest, res: Response) {
    try {
      const { message, sessionId, history, title } = req.body as {
        message: string;
        sessionId?: string;
        history?: ChatHistoryEntry[];
        title?: string;
      };

      const trimmedMessage = message?.trim();
      if (!trimmedMessage) {
        return res.status(400).json({ success: false, error: 'Message is required' });
      }

      const user = req.user;
      const dept = (user as { department?: string | null } | undefined)?.department || 'general';
      const session = await ensureSessionForUser(req.user!.id, sessionId, title || createDefaultTitle(trimmedMessage));

      if (!sessionId && isGenericSessionTitle(session.title)) {
        await prisma.aiChatSession.update({
          where: { id: session.id },
          data: { title: createDefaultTitle(trimmedMessage) },
        });
      }

      await seedLegacyHistory(session.id, history);

      await prisma.aiChatMessage.create({
        data: {
          sessionId: session.id,
          role: 'user',
          content: trimmedMessage,
        },
      });

      const conversation = await listContextMessages(session.id);
      const normalizedConversation = conversation
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((entry) => ({ role: entry.role, content: entry.content }));

      try {
        const reply = await callGenie(trimmedMessage, dept, normalizedConversation);

        await prisma.aiChatMessage.create({
          data: {
            sessionId: session.id,
            role: 'assistant',
            content: reply || 'No response available.',
          },
        });

        const updatedSession = await getSessionWithMeta(req.user!.id, session.id);
        return res.json({
          success: true,
          data: {
            reply: reply || 'No response available.',
            department: dept,
            session: toSessionSummary(updatedSession),
            sessionId: session.id,
          },
        });
      } catch (err: any) {
        console.error('Gemini error:', err);
        return res.status(502).json({ success: false, error: 'AI service error: ' + (err.message || 'unavailable') });
      }
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return res.status(error.statusCode || 500).json({ success: false, error: error.message || 'AI chat failed' });
    }
  },
};

export default aiController;
