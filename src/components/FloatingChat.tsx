import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Loader2, History, ArrowLeft, Dumbbell, Apple, Brain, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { streamChat, canSendMessage, recordMessage, getRemainingMessages } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Msg = { role: "user" | "assistant"; content: string };
type Conversation = {
  id: string;
  title: string;
  category: string;
  message_count: number;
  created_at: string;
  updated_at: string;
};

type ViewMode = "chat" | "history";

const categoryIcons: Record<string, typeof Dumbbell> = {
  treino: Dumbbell,
  nutrição: Apple,
  mentalidade: Brain,
};

const categoryColors: Record<string, string> = {
  treino: "text-primary",
  nutrição: "text-accent",
  mentalidade: "text-purple-400",
};

function parseSuggestions(content: string): { cleanContent: string; suggestions: string[] } {
  const suggestionsMatch = content.match(/\[SUGESTÕES\]\s*\n([\s\S]*?)$/);
  if (!suggestionsMatch) return { cleanContent: content, suggestions: [] };

  const cleanContent = content.replace(/---\s*\n\[SUGESTÕES\][\s\S]*$/, "").trim();
  const suggestionsText = suggestionsMatch[1];
  const suggestions = suggestionsText
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter((l) => l.length > 0)
    .slice(0, 3);

  return { cleanContent, suggestions };
}

const FloatingChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingMessages());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoadingHistory(true);
    const { data } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setConversations((data as Conversation[]) || []);
    setLoadingHistory(false);
  }, [user]);

  const openConversation = async (conv: Conversation) => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true });

    const msgs: Msg[] = (data || []).map((m: any) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    setMessages(msgs);
    setCurrentConversationId(conv.id);
    setView("chat");
  };

  const deleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await supabase.from("chat_conversations").delete().eq("id", convId);
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (currentConversationId === convId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setView("chat");
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role,
      content,
    });
    await supabase
      .from("chat_conversations")
      .update({ message_count: messages.length + 1, updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  };

  const categorizeMessage = async (text: string): Promise<string> => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [{ role: "user", content: text }], type: "categorize" }),
      });
      if (!resp.ok) return "treino";
      const data = await resp.json();
      const cat = (data.choices?.[0]?.message?.content || "treino").toLowerCase().trim();
      if (["treino", "nutrição", "mentalidade"].includes(cat)) return cat;
      return "treino";
    } catch {
      return "treino";
    }
  };

  const send = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;
    if (!canSendMessage()) {
      toast.error("Limite de 3 mensagens por dia atingido!");
      return;
    }

    const userMsg: Msg = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    recordMessage();
    setRemaining(getRemainingMessages());

    // Create or use existing conversation
    let convId = currentConversationId;
    if (!convId && user) {
      const category = await categorizeMessage(messageText);
      const { data: newConv } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: user.id,
          title: messageText.slice(0, 100),
          category,
          message_count: 1,
        })
        .select()
        .single();
      if (newConv) {
        convId = newConv.id;
        setCurrentConversationId(convId);
      }
    }

    if (convId) await saveMessage(convId, "user", messageText);

    let assistantText = "";
    const updateAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantText } : m));
        }
        return [...prev, { role: "assistant", content: assistantText }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: updateAssistant,
        onDone: async () => {
          setLoading(false);
          if (convId && assistantText) {
            await saveMessage(convId, "assistant", assistantText);
          }
        },
      });
    } catch (e: any) {
      toast.error(e.message || "Erro ao conectar com a IA");
      setLoading(false);
    }
  };

  const handleOpenHistory = () => {
    loadConversations();
    setView("history");
  };

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
  const { suggestions } = lastAssistantMsg ? parseSuggestions(lastAssistantMsg.content) : { suggestions: [] };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform animate-scale-in"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[22rem] h-[32rem] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-card shrink-0">
            {view === "history" && (
              <button onClick={startNewChat} className="text-muted-foreground hover:text-foreground mr-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Bot className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-heading font-bold">
                {view === "history" ? "Histórico" : "Coach IA"}
              </p>
              {view === "chat" && (
                <p className="text-[10px] text-muted-foreground">{remaining} mensagens restantes hoje</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {view === "chat" && (
                <button onClick={handleOpenHistory} className="text-muted-foreground hover:text-foreground p-1">
                  <History className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {view === "history" ? (
            /* ===== HISTORY VIEW ===== */
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <Button size="sm" variant="outline" className="w-full mb-2" onClick={startNewChat}>
                + Nova conversa
              </Button>
              {loadingHistory && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!loadingHistory && conversations.length === 0 && (
                <p className="text-center text-muted-foreground text-xs py-8">Nenhuma conversa ainda</p>
              )}
              {conversations.map((conv) => {
                const Icon = categoryIcons[conv.category] || Dumbbell;
                const color = categoryColors[conv.category] || "text-primary";
                return (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conv.title || "Conversa"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(conv.created_at), "dd MMM yyyy", { locale: ptBR })}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {conv.message_count} msgs
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* ===== CHAT VIEW ===== */
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-xs py-8">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Olá! Sou seu treinador virtual. ⚽</p>
                    <p className="mt-1">Pergunte sobre treino, nutrição ou recuperação!</p>
                  </div>
                )}
                {messages.map((m, i) => {
                  const { cleanContent, suggestions: msgSuggestions } =
                    m.role === "assistant" ? parseSuggestions(m.content) : { cleanContent: m.content, suggestions: [] };
                  const isLastAssistant = m.role === "assistant" && i === messages.length - 1;

                  return (
                    <div key={i}>
                      <div className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                            m.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          )}
                        >
                          {m.role === "assistant" ? (
                            <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold [&_strong]:text-foreground">
                              <ReactMarkdown>{cleanContent}</ReactMarkdown>
                            </div>
                          ) : (
                            <span className="whitespace-pre-wrap">{cleanContent}</span>
                          )}
                        </div>
                      </div>
                      {/* Quick suggestions for last assistant message */}
                      {isLastAssistant && !loading && msgSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                          {msgSuggestions.map((s, si) => (
                            <button
                              key={si}
                              onClick={() => send(s)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {loading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-xl px-3 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border/30 shrink-0">
                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pergunte ao Coach..."
                    className="flex-1 h-9 text-sm bg-muted/50 border-border/50"
                    disabled={loading || remaining === 0}
                  />
                  <Button type="submit" size="sm" className="h-9 w-9 p-0" disabled={loading || !input.trim() || remaining === 0}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChat;
