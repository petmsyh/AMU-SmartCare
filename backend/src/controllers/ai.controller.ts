import { Request, Response } from 'express';
import { AuthRequest } from '../types';

const GENIE_KEY = process.env.GENIE_API_KEY || process.env.GEMNI_API_KEY || process.env.GEMNIE_API_KEY || process.env.GEMNIE_API_KEY;
const GENIE_URL = process.env.GENIE_API_URL || process.env.GEMNI_API_URL || process.env.GEMNIE_API_URL || 'https://api.genie.example/v1/chat';

async function callGenie(message: string, dept: string, history?: any[]) {
  if (!GENIE_KEY) throw new Error('Genie API key not configured');
  // If a custom GENIE_URL is provided, use it with Bearer auth
  if (GENIE_URL && !GENIE_URL.includes('api.genie.example')) {
    const payload = {
      input: message,
      context: { department: dept },
      history: history || [],
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

  // Detect Google-style API key (starts with AI) and call Google Generative API
  if (GENIE_KEY.startsWith('AIza')) {
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${GENIE_KEY}`;
    const historyText = (history || [])
      .map((h: any) => `${h.role || 'user'}: ${h.content || h}`)
      .join('\n');
    const prompt = `Department: ${dept}\n\n${historyText}\nUser: ${message}`;

    const body = {
      prompt: { text: prompt },
      temperature: 0.2,
      maxOutputTokens: 512,
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
    // Google GL responses typically include `candidates[0].output`
    return data?.candidates?.[0]?.output || data?.candidates?.[0]?.content || null;
  }

  // Fallback: try GENIE_URL default behavior
  const payload = {
    input: message,
    context: { department: dept },
    history: history || [],
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

export const aiController = {
  async chat(req: AuthRequest, res: Response) {
    try {
      const { message, history } = req.body as { message: string; history?: any[] };
      const user = req.user;
      const dept = (user as any)?.department || 'general';

          try {
            const reply = await callGenie(message, dept, history);
            return res.json({ success: true, data: { reply, department: dept } });
          } catch (err: any) {
            // Log detailed error server-side and return 502 to client
            console.error('Gemnie error:', err);
            return res.status(502).json({ success: false, error: 'AI service error: ' + (err.message || 'unavailable') });
          }
    } catch (err) {
      return res.status(500).json({ success: false, error: 'AI chat failed' });
    }
  },
};

export default aiController;
