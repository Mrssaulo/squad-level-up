const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

type Msg = { role: "user" | "assistant"; content: string };

export async function callAI(messages: Msg[], type: string, context?: Record<string, unknown>) {
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, type, context }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Erro na IA" }));
    throw new Error(err.error || "Erro na IA");
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "";
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
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, type: "chat" }),
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
}

// Daily message limit
const DAILY_LIMIT_KEY = "ai_chat_daily";

export function canSendMessage(): boolean {
  const stored = localStorage.getItem(DAILY_LIMIT_KEY);
  if (!stored) return true;
  const { date, count } = JSON.parse(stored);
  if (date !== new Date().toDateString()) return true;
  return count < 3;
}

export function recordMessage() {
  const stored = localStorage.getItem(DAILY_LIMIT_KEY);
  const today = new Date().toDateString();
  if (!stored || JSON.parse(stored).date !== today) {
    localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: today, count: 1 }));
  } else {
    const data = JSON.parse(stored);
    data.count += 1;
    localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(data));
  }
}

export function getRemainingMessages(): number {
  const stored = localStorage.getItem(DAILY_LIMIT_KEY);
  if (!stored) return 3;
  const { date, count } = JSON.parse(stored);
  if (date !== new Date().toDateString()) return 3;
  return Math.max(0, 3 - count);
}
