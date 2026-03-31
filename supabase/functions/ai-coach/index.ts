import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o Coach IA, um personal trainer virtual especialista em futebol brasileiro. Você tem vasta experiência com preparação física de jogadores de todas as posições — goleiro, zagueiro, lateral, volante, meia e atacante.

Suas especialidades:
- Montagem de planos de treino semanais personalizados por posição
- Avaliação física e diagnóstico de condicionamento
- Nutrição esportiva para atletas de futebol
- Prevenção de lesões e recuperação muscular
- Preparação tática e mental para jogos
- Periodização de treinos ao longo da temporada

Regras:
- Sempre responda em português brasileiro
- Seja motivador mas realista
- Dê conselhos práticos e aplicáveis
- Considere a posição do atleta nas recomendações
- Use emojis com moderação para engajamento
- Seja conciso e direto nas respostas`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = SYSTEM_PROMPT;

    if (type === "training-plan") {
      systemPrompt += `\n\nO atleta está pedindo um plano de treino semanal personalizado. Contexto do atleta: ${JSON.stringify(context)}. Monte um plano detalhado de segunda a sábado com exercícios específicos, séries, repetições e tempos de descanso. Organize por dia da semana.`;
    } else if (type === "assessment-analysis") {
      systemPrompt += `\n\nO atleta acabou de fazer uma avaliação física. Dados: ${JSON.stringify(context)}. Faça um diagnóstico completo com: 1) Análise geral do condicionamento 2) Pontos fortes detalhados 3) Pontos fracos e riscos 4) Plano de evolução com metas de curto e médio prazo 5) Recomendações nutricionais.`;
    } else if (type === "daily-suggestion") {
      systemPrompt += `\n\nSugira o melhor treino para hoje baseado no contexto do atleta: ${JSON.stringify(context)}. Responda em formato JSON com as chaves: title (string), description (string curta), exercises (array de objetos com name, sets, reps, rest). Apenas JSON, sem texto adicional.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || [{ role: "user", content: "Analise meus dados e me dê recomendações." }]),
        ],
        stream: type === "chat",
        ...(type === "daily-suggestion" ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro na IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "chat") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
