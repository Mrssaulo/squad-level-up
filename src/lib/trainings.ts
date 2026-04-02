export interface Training {
  id: string;
  title: string;
  category: "Físico" | "Técnico" | "Tático" | "Recuperação";
  duration: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  description: string;
  thumbnail: string;
  positions: string[];
  demoUrl?: string;
  demoType?: "gif" | "video";
}

const ALL_POSITIONS = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Centroavante"];

export const trainings: Training[] = [
  { id: "1", title: "Corrida Intervalada", category: "Físico", duration: "30 min", difficulty: "Difícil", description: "Sprints de 200m com recuperação ativa. Melhora VO2max e resistência em campo.", thumbnail: "🏃", positions: ["Lateral", "Volante", "Meia", "Ponta"] },
  { id: "2", title: "Domínio e Controle", category: "Técnico", duration: "25 min", difficulty: "Médio", description: "Exercícios de primeiro toque, controle orientado e passes curtos.", thumbnail: "⚽", positions: ALL_POSITIONS },
  { id: "3", title: "Posicionamento Tático", category: "Tático", duration: "40 min", difficulty: "Difícil", description: "Movimentação sem bola, linhas de passe e leitura de jogo.", thumbnail: "📋", positions: ["Zagueiro", "Volante", "Meia", "Centroavante"] },
  { id: "4", title: "Alongamento Ativo", category: "Recuperação", duration: "20 min", difficulty: "Fácil", description: "Sequência de alongamentos dinâmicos para recuperação muscular.", thumbnail: "🧘", positions: ALL_POSITIONS },
  { id: "5", title: "Força Explosiva", category: "Físico", duration: "35 min", difficulty: "Difícil", description: "Agachamento, saltos pliométricos e exercícios de potência.", thumbnail: "💪", positions: ["Zagueiro", "Centroavante", "Goleiro"] },
  { id: "6", title: "Finalização", category: "Técnico", duration: "30 min", difficulty: "Médio", description: "Chutes de média e longa distância, cabeceio e voleios.", thumbnail: "🎯", positions: ["Meia", "Ponta", "Centroavante"] },
  { id: "7", title: "Jogo Reduzido 4x4", category: "Tático", duration: "25 min", difficulty: "Médio", description: "Campo reduzido para decisões rápidas e transições.", thumbnail: "⚔️", positions: ALL_POSITIONS },
  { id: "8", title: "Crioterapia & Foam Roller", category: "Recuperação", duration: "15 min", difficulty: "Fácil", description: "Liberação miofascial e recuperação com gelo.", thumbnail: "❄️", positions: ALL_POSITIONS },
  { id: "9", title: "Agilidade com Cones", category: "Físico", duration: "20 min", difficulty: "Médio", description: "Drills de mudança de direção, ladder e slalom.", thumbnail: "🔷", positions: ["Lateral", "Ponta", "Meia", "Goleiro"] },
  { id: "10", title: "Passe Longo", category: "Técnico", duration: "25 min", difficulty: "Difícil", description: "Lançamentos, bolas em profundidade e cruzamentos.", thumbnail: "🎯", positions: ["Zagueiro", "Lateral", "Volante", "Meia"] },
  { id: "11", title: "Marcação Pressão", category: "Tático", duration: "30 min", difficulty: "Difícil", description: "Pressão alta, encaixe de marcação e desarme.", thumbnail: "🛡️", positions: ["Zagueiro", "Volante", "Lateral"] },
  { id: "12", title: "Yoga para Atletas", category: "Recuperação", duration: "30 min", difficulty: "Fácil", description: "Flexibilidade, equilíbrio e foco mental.", thumbnail: "🧘", positions: ALL_POSITIONS },
  { id: "13", title: "Reflexos e Quedas", category: "Técnico", duration: "25 min", difficulty: "Difícil", description: "Defesas baixas, saídas de gol e posicionamento no arco.", thumbnail: "🧤", positions: ["Goleiro"] },
  { id: "14", title: "Cruzamento e Overlap", category: "Tático", duration: "30 min", difficulty: "Médio", description: "Subidas pela lateral, cruzamentos e retorno defensivo.", thumbnail: "↗️", positions: ["Lateral", "Ponta"] },
  { id: "15", title: "Cabeceio e Bola Aérea", category: "Técnico", duration: "20 min", difficulty: "Médio", description: "Timing de salto, posicionamento e cabeceio ofensivo e defensivo.", thumbnail: "🦅", positions: ["Zagueiro", "Centroavante"] },
];

export const positionFilters = ["Todos", "Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Centroavante"] as const;

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

export function getDetailedAssessment(position: string, category: string, imc: number, fat: number, run12: number) {
  const conditioningLevel = run12 >= 2800 ? "Excelente" : run12 >= 2400 ? "Bom" : run12 >= 2000 ? "Regular" : "Baixo";

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (imc >= 20 && imc <= 24) strengths.push("Composição corporal ideal");
  else improvements.push("Ajustar composição corporal");

  if (fat < 12) strengths.push("Percentual de gordura excelente");
  else if (fat < 18) strengths.push("Percentual de gordura aceitável");
  else improvements.push("Reduzir percentual de gordura");

  if (run12 >= 2800) strengths.push("Resistência aeróbica de elite");
  else if (run12 >= 2400) strengths.push("Boa capacidade aeróbica");
  else improvements.push("Melhorar resistência aeróbica");

  const positionStrengths: Record<string, Record<string, string[]>> = {
    Goleiro: { Elite: ["Reflexos apurados", "Explosão muscular"], Bom: ["Base sólida de posicionamento"], Desenvolver: ["Potencial para evolução rápida"] },
    Zagueiro: { Elite: ["Marcação sólida", "Leitura de jogo"], Bom: ["Boa presença física"], Desenvolver: ["Fundamentos em construção"] },
    Lateral: { Elite: ["Alta resistência", "Projeção ofensiva"], Bom: ["Boa capacidade de ida e volta"], Desenvolver: ["Resistência em desenvolvimento"] },
    Volante: { Elite: ["Cobertura eficiente", "Distribuição precisa"], Bom: ["Boa marcação"], Desenvolver: ["Posicionamento em evolução"] },
    Meia: { Elite: ["Visão de jogo refinada", "Passes decisivos"], Bom: ["Criatividade em campo"], Desenvolver: ["Técnica em construção"] },
    Ponta: { Elite: ["Velocidade explosiva", "Dribles eficientes"], Bom: ["Boa aceleração"], Desenvolver: ["Velocidade em desenvolvimento"] },
    Centroavante: { Elite: ["Finalização precisa", "Posicionamento letal"], Bom: ["Boa presença na área"], Desenvolver: ["Movimentação em evolução"] },
  };

  const posSpecific = positionStrengths[position]?.[category] || [];
  strengths.push(...posSpecific);

  const recommendation = getPositionRecommendation(position, category);

  return { conditioningLevel, strengths, improvements, recommendation };
}
