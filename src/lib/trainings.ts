export interface Training {
  id: string;
  title: string;
  category: "Físico" | "Técnico" | "Tático" | "Recuperação";
  duration: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  description: string;
  thumbnail: string;
}

export const trainings: Training[] = [
  { id: "1", title: "Corrida Intervalada", category: "Físico", duration: "30 min", difficulty: "Difícil", description: "Sprints de 200m com recuperação ativa. Melhora VO2max e resistência em campo.", thumbnail: "🏃" },
  { id: "2", title: "Domínio e Controle", category: "Técnico", duration: "25 min", difficulty: "Médio", description: "Exercícios de primeiro toque, controle orientado e passes curtos.", thumbnail: "⚽" },
  { id: "3", title: "Posicionamento Tático", category: "Tático", duration: "40 min", difficulty: "Difícil", description: "Movimentação sem bola, linhas de passe e leitura de jogo.", thumbnail: "📋" },
  { id: "4", title: "Alongamento Ativo", category: "Recuperação", duration: "20 min", difficulty: "Fácil", description: "Sequência de alongamentos dinâmicos para recuperação muscular.", thumbnail: "🧘" },
  { id: "5", title: "Força Explosiva", category: "Físico", duration: "35 min", difficulty: "Difícil", description: "Agachamento, saltos pliométricos e exercícios de potência.", thumbnail: "💪" },
  { id: "6", title: "Finalização", category: "Técnico", duration: "30 min", difficulty: "Médio", description: "Chutes de média e longa distância, cabeceio e voleios.", thumbnail: "🎯" },
  { id: "7", title: "Jogo Reduzido 4x4", category: "Tático", duration: "25 min", difficulty: "Médio", description: "Campo reduzido para decisões rápidas e transições.", thumbnail: "⚔️" },
  { id: "8", title: "Crioterapia & Foam Roller", category: "Recuperação", duration: "15 min", difficulty: "Fácil", description: "Liberação miofascial e recuperação com gelo.", thumbnail: "❄️" },
  { id: "9", title: "Agilidade com Cones", category: "Físico", duration: "20 min", difficulty: "Médio", description: "Drills de mudança de direção, ladder e slalom.", thumbnail: "🔷" },
  { id: "10", title: "Passe Longo", category: "Técnico", duration: "25 min", difficulty: "Difícil", description: "Lançamentos, bolas em profundidade e cruzamentos.", thumbnail: "🎯" },
  { id: "11", title: "Marcação Pressão", category: "Tático", duration: "30 min", difficulty: "Difícil", description: "Pressão alta, encaixe de marcação e desarme.", thumbnail: "🛡️" },
  { id: "12", title: "Yoga para Atletas", category: "Recuperação", duration: "30 min", difficulty: "Fácil", description: "Flexibilidade, equilíbrio e foco mental.", thumbnail: "🧘" },
];

export function getPositionRecommendation(position: string, category: string): string {
  const recs: Record<string, Record<string, string>> = {
    Goleiro: { Elite: "Foque em reflexos e explosão lateral", Bom: "Melhore saídas de gol e jogo com os pés", Desenvolver: "Trabalhe resistência e posicionamento básico" },
    Zagueiro: { Elite: "Aprimore leitura de jogo e bola aérea", Bom: "Trabalhe velocidade de reação e passe longo", Desenvolver: "Foque em marcação e força de base" },
    Lateral: { Elite: "Maximize resistência e cruzamentos", Bom: "Melhore timing de overlap e defesa", Desenvolver: "Trabalhe condicionamento e posicionamento" },
    Volante: { Elite: "Aperfeiçoe distribuição e cobertura", Bom: "Melhore recuperação de bola e passes", Desenvolver: "Foque em resistência e marcação" },
    Meia: { Elite: "Refine visão de jogo e passes decisivos", Bom: "Trabalhe finalização e assistências", Desenvolver: "Melhore condicionamento e primeiro toque" },
    Ponta: { Elite: "Aprimore dribles e finalizações", Bom: "Trabalhe velocidade e cruzamentos", Desenvolver: "Foque em resistência e controle de bola" },
    Centroavante: { Elite: "Maximize finalização e posicionamento", Bom: "Trabalhe cabeceio e jogo de costas", Desenvolver: "Melhore movimentação e força" },
  };
  return recs[position]?.[category] || "Continue treinando com consistência!";
}
