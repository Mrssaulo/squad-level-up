import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o Coach IA, um personal trainer virtual especialista em futebol brasileiro. Você tem vasta experiência com preparação física de jogadores de todas as posições — goleiro, zagueiro, lateral, volante, meia e atacante.

Suas especialidades:
- Montagem de planos de treino semanais personalizados por posição
- Avaliação física e diagnóstico de condicionamento
- Nutrição esportiva para atletas de futebol (hidratação, suplementação, dieta de jogo, pré e pós treino)
- Prevenção de lesões e recuperação muscular (alongamento, crioterapia, descanso ativo)
- Preparação tática e mental para jogos (visualização, foco, controle emocional, gestão de pressão)
- Periodização de treinos ao longo da temporada
- Desenvolvimento técnico individual (domínio, passe, finalização, drible, cabeceio)
- Mentalidade e preparação psicológica para atletas (motivação, resiliência, confiança, rotina pré-jogo)

Regras de formatação:
- Sempre responda em português brasileiro
- Use formatação limpa: títulos em negrito com **, listas com - ou números
- Seja motivador mas realista
- Dê conselhos práticos e aplicáveis
- Considere a posição do atleta nas recomendações
- Use emojis com moderação para engajamento (máximo 2-3 por resposta)
- Seja conciso e direto nas respostas
- Ao final de CADA resposta, inclua uma linha separadora --- e depois exatamente 3 sugestões de perguntas relacionadas no formato:
[SUGESTÕES]
1. Primeira sugestão de pergunta
2. Segunda sugestão de pergunta
3. Terceira sugestão de pergunta`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = SYSTEM_PROMPT;

    if (type === "training-plan") {
      systemPrompt += `\n\nO atleta está pedindo um plano de treino semanal personalizado. Contexto do atleta: ${JSON.stringify(context)}. Monte um plano detalhado de segunda a sábado. Responda APENAS em formato JSON com a estrutura: { "days": [{ "day": "Segunda", "exercises": [{ "name": "...", "sets": 3, "reps": 12, "rest": "60s", "instruction": "..." }] }] }. Sem texto adicional, apenas JSON. NÃO inclua sugestões neste caso.`;
    } else if (type === "assessment-analysis") {
      systemPrompt += `\n\nO atleta acabou de fazer uma avaliação física. Dados: ${JSON.stringify(context)}. Faça um diagnóstico completo com: 1) Análise geral do condicionamento 2) Pontos fortes detalhados 3) Pontos fracos e riscos 4) Plano de evolução com metas de curto e médio prazo 5) Recomendações nutricionais.`;
    } else if (type === "daily-suggestion") {
      systemPrompt += `\n\nSugira o melhor treino para hoje baseado no contexto do atleta: ${JSON.stringify(context)}. Responda em formato JSON com as chaves: title (string), description (string curta), exercises (array de objetos com name, sets, reps, rest). Apenas JSON, sem texto adicional. NÃO inclua sugestões neste caso.`;
    } else if (type === "categorize") {
      systemPrompt = `Analise a seguinte mensagem e classifique em UMA das categorias: treino, nutrição, mentalidade. Responda APENAS com a palavra da categoria, nada mais.`;
    }

    const aiBody = JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...(messages || [{ role: "user", content: "Analise meus dados e me dê recomendações." }]),
      ],
      stream: type === "chat",
      ...(type === "daily-suggestion" ? { response_format: { type: "json_object" } } : {}),
    });

    // Retry with exponential backoff for rate limits
    let response: Response | null = null;
    const maxRetries = 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: aiBody,
      });

      if (response.status !== 429 || attempt === maxRetries) break;
      const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
      await new Promise((r) => setTimeout(r, delay));
    }

    if (!response) throw new Error("No response from AI gateway");

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
