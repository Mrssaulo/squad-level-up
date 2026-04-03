import { backendPublishableKey, backendUrl } from "@/lib/backend";

const AI_URL = `${backendUrl}/functions/v1/ai-coach`;

type Msg = { role: "user" | "assistant"; content: string };

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* blocked */ }
}

function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json); } catch { return fallback; }
}

export async function callAI(messages: Msg[], type: string, context?: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const resp = await fetch(AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendPublishableKey}`,
      },
      body: JSON.stringify({ messages, type, context }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Erro na IA" }));
      throw new Error(err.error || "Erro na IA");
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (e: any) {
    if (e.name === "AbortError") throw new Error("A requisição de IA demorou demais. Tente novamente.");
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

export async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const resp = await fetch(AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendPublishableKey}`,
      },
      body: JSON.stringify({ messages, type: "chat" }),
      signal: controller.signal,
    });

    if (!resp.ok || !resp.body) {
      const err = await resp.json().catch(() => ({ error: "Erro na IA" }));
      throw new Error(err.error || "Erro na IA");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* partial json */ }
      }
    }
    onDone();
  } catch (e: any) {
    if (e.name === "AbortError") throw new Error("A conexão com o coach expirou. Tente novamente.");
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

// Daily message limit
const DAILY_LIMIT_KEY = "ai_chat_daily";
const FREE_DAILY_LIMIT = 1;

export function canSendMessage(): boolean {
  const stored = safeGet(DAILY_LIMIT_KEY);
  if (!stored) return true;
  const data = safeParse<{ date: string; count: number }>(stored, { date: "", count: 0 });
  if (data.date !== new Date().toDateString()) return true;
  return data.count < FREE_DAILY_LIMIT;
}

export function recordMessage() {
  const today = new Date().toDateString();
  const stored = safeGet(DAILY_LIMIT_KEY);
  const data = safeParse<{ date: string; count: number }>(stored, { date: "", count: 0 });
  if (data.date !== today) {
    safeSet(DAILY_LIMIT_KEY, JSON.stringify({ date: today, count: 1 }));
  } else {
    data.count += 1;
    safeSet(DAILY_LIMIT_KEY, JSON.stringify(data));
  }
}

export function getRemainingMessages(): number {
  const stored = safeGet(DAILY_LIMIT_KEY);
  if (!stored) return FREE_DAILY_LIMIT;
  const data = safeParse<{ date: string; count: number }>(stored, { date: "", count: 0 });
  if (data.date !== new Date().toDateString()) return FREE_DAILY_LIMIT;
  return Math.max(0, FREE_DAILY_LIMIT - data.count);
}
