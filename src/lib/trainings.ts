export interface TrainingExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instruction: string;
  adaptation?: string;
}

export type SpaceRequired = "pequeno" | "médio" | "amplo";
export type MaterialType = "nenhum" | "bola" | "cones" | "elástico" | "básico";
export type TrainingLocation = "casa" | "quintal" | "quadra" | "campo" | "academia";

export interface Training {
  id: string;
  title: string;
  focus: string;
  category: "Físico" | "Técnico" | "Tático" | "Recuperação";
  duration: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  description: string;
  thumbnail: string;
  positions: string[];
  solo: true;
  spaceRequired: SpaceRequired;
  material: MaterialType[];
  locations: TrainingLocation[];
  exercises: TrainingExercise[];
  adaptationNote: string;
  practicalTip: string;
  demoUrl?: string;
  demoType?: "gif" | "video";
}

const ALL_POSITIONS = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Centroavante"];

export const trainings: Training[] = [
  {
    id: "1",
    title: "Corrida Intervalada Solo",
    focus: "Resistência aeróbica e explosão",
    category: "Físico",
    duration: "25 min",
    difficulty: "Difícil",
    description: "Sprints curtos com recuperação ativa. Melhora seu fôlego e resistência para aguentar os 90 minutos.",
    thumbnail: "🏃",
    positions: ["Lateral", "Volante", "Meia", "Ponta"],
    solo: true,
    spaceRequired: "médio",
    material: ["nenhum"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Aquecimento trote leve", sets: 1, reps: "3 min", rest: "—", instruction: "Trote leve para aquecer o corpo. Movimente os braços." },
      { name: "Sprint 30m + trote volta", sets: 6, reps: "30m ida", rest: "45s", instruction: "Corra em velocidade máxima por 30m, volte trotando. Se não tiver 30m, use 15m ida e volta." },
      { name: "Corrida lateral ida e volta", sets: 4, reps: "20m", rest: "30s", instruction: "Deslocamento lateral rápido. Mantenha os joelhos semiflexionados.", adaptation: "Em espaço pequeno, faça 10m ida e volta." },
      { name: "Sprint progressivo", sets: 4, reps: "40m", rest: "60s", instruction: "Comece devagar e acelere até o máximo nos últimos 10m." },
      { name: "Desaceleração ativa", sets: 1, reps: "3 min", rest: "—", instruction: "Caminhada leve para voltar à calma. Respire fundo." },
    ],
    adaptationNote: "Sem espaço amplo? Faça os sprints em distâncias menores (10-15m) com mais repetições. Escada ou rampa também funcionam.",
    practicalTip: "Marque a distância com chinelos ou garrafas. Cronometre pelo celular.",
  },
  {
    id: "2",
    title: "Domínio e Controle com Bola",
    focus: "Primeiro toque e controle orientado",
    category: "Técnico",
    duration: "20 min",
    difficulty: "Médio",
    description: "Exercícios de toque, controle e condução que você faz sozinho com uma bola e uma parede.",
    thumbnail: "⚽",
    positions: ALL_POSITIONS,
    solo: true,
    spaceRequired: "pequeno",
    material: ["bola"],
    locations: ["casa", "quintal", "quadra"],
    exercises: [
      { name: "Toque contra a parede", sets: 4, reps: "30s", rest: "20s", instruction: "Passe a bola na parede e controle com o pé direito. Alterne os pés a cada série.", adaptation: "Sem parede? Jogue a bola pra cima e controle com diferentes partes do corpo." },
      { name: "Controle orientado", sets: 4, reps: "20 toques", rest: "20s", instruction: "Receba a bola da parede e gire 90° antes do segundo toque. Simule receber marcado." },
      { name: "Domínio com sola do pé", sets: 3, reps: "30s", rest: "15s", instruction: "Role a bola com a sola, alternando os pés. Mantenha a cabeça erguida." },
      { name: "Condução em 8", sets: 4, reps: "30s", rest: "20s", instruction: "Coloque dois objetos a 3m de distância e conduza a bola em oito ao redor deles.", adaptation: "Use garrafas, pedras ou chinelos como marcadores." },
      { name: "Embaixadinha livre", sets: 3, reps: "1 min", rest: "30s", instruction: "Mantenha a bola no ar o máximo que conseguir. Alterne pés, coxa e cabeça." },
    ],
    adaptationNote: "Pode fazer em qualquer espaço com 3x3m. Uma parede lisa ajuda, mas não é obrigatória.",
    practicalTip: "Foque na qualidade do toque, não na velocidade. Primeiro toque suave e direcionado.",
  },
  {
    id: "3",
    title: "Leitura de Jogo Solo",
    focus: "Posicionamento e tomada de decisão",
    category: "Tático",
    duration: "30 min",
    difficulty: "Difícil",
    description: "Exercícios de deslocamento e posicionamento sem bola. Treine movimentação inteligente sozinho.",
    thumbnail: "📋",
    positions: ["Zagueiro", "Volante", "Meia", "Centroavante"],
    solo: true,
    spaceRequired: "médio",
    material: ["cones"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Shadow play: cobertura", sets: 4, reps: "45s", rest: "30s", instruction: "Simule cobertura defensiva. Desloque-se lateralmente entre dois pontos como se estivesse fechando espaços.", adaptation: "Use garrafas ou pedras como referência." },
      { name: "Desmarque e reposicionamento", sets: 5, reps: "30s", rest: "20s", instruction: "Corra 5m, pare, mude de direção 90° e acelere. Simule desmarcar de um adversário imaginário." },
      { name: "Leitura de linha", sets: 4, reps: "40s", rest: "30s", instruction: "Posicione 4 objetos em linha. Desloque-se mantendo a linha, avançando e recuando como uma linha defensiva." },
      { name: "Transição ataque-defesa", sets: 6, reps: "20s", rest: "20s", instruction: "Sprint curto para frente (ataque), volte correndo de costas (defesa). Simule transição real." },
      { name: "Visualização tática", sets: 1, reps: "5 min", rest: "—", instruction: "Sente-se. Feche os olhos. Visualize 3 jogadas táticas da sua posição. Imagine o posicionamento, a linha de passe, a decisão." },
    ],
    adaptationNote: "Funciona em espaço de 10x10m. Use qualquer objeto como marcador. Não precisa de bola.",
    practicalTip: "A parte mental é tão importante quanto a física. A visualização melhora sua tomada de decisão em jogo real.",
  },
  {
    id: "4",
    title: "Recuperação Ativa",
    focus: "Recuperação muscular e flexibilidade",
    category: "Recuperação",
    duration: "20 min",
    difficulty: "Fácil",
    description: "Sequência de alongamentos e mobilidade para recuperar após treinos intensos. Zero equipamento.",
    thumbnail: "🧘",
    positions: ALL_POSITIONS,
    solo: true,
    spaceRequired: "pequeno",
    material: ["nenhum"],
    locations: ["casa", "quintal"],
    exercises: [
      { name: "Respiração diafragmática", sets: 1, reps: "2 min", rest: "—", instruction: "Deite de barriga pra cima. Inspire pelo nariz em 4s, segure 4s, expire pela boca em 6s." },
      { name: "Alongamento de posterior", sets: 2, reps: "30s cada perna", rest: "10s", instruction: "Sentado, perna estendida. Incline o tronco à frente sem forçar. Sinta o alongamento na parte de trás da coxa." },
      { name: "Rotação de quadril", sets: 2, reps: "10 cada lado", rest: "10s", instruction: "De pé, levante o joelho e faça círculos amplos com a perna. Controle o movimento." },
      { name: "Cat-cow (gato-vaca)", sets: 3, reps: "10 repetições", rest: "10s", instruction: "De quatro apoios. Arqueie e curve a coluna alternadamente, respirando no ritmo." },
      { name: "Alongamento de quadríceps", sets: 2, reps: "30s cada perna", rest: "10s", instruction: "De pé, puxe o pé em direção ao glúteo. Mantenha os joelhos juntos." },
      { name: "Relaxamento final", sets: 1, reps: "2 min", rest: "—", instruction: "Deite de barriga pra cima, braços abertos. Feche os olhos e relaxe cada parte do corpo." },
    ],
    adaptationNote: "Pode fazer no quarto, na sala ou em qualquer piso. Um tapete ou toalha ajuda no conforto.",
    practicalTip: "Faça esse treino no dia seguinte a treinos intensos. Sua recuperação define seu progresso.",
  },
  {
    id: "5",
    title: "Força Explosiva Sem Equipamento",
    focus: "Potência muscular e impulsão vertical",
    category: "Físico",
    duration: "30 min",
    difficulty: "Difícil",
    description: "Exercícios de força e explosão com peso do corpo. Perfeito para ganhar potência no salto e na arrancada.",
    thumbnail: "💪",
    positions: ["Zagueiro", "Centroavante", "Goleiro"],
    solo: true,
    spaceRequired: "pequeno",
    material: ["nenhum"],
    locations: ["casa", "quintal", "academia"],
    exercises: [
      { name: "Agachamento explosivo", sets: 4, reps: "10", rest: "45s", instruction: "Agache até a coxa ficar paralela ao chão e salte o mais alto que conseguir. Aterrisse suavemente." },
      { name: "Avanço alternado com salto", sets: 3, reps: "8 cada perna", rest: "45s", instruction: "Avanço profundo, troque as pernas no ar. Mantenha o tronco ereto." },
      { name: "Salto em caixa (ou degrau)", sets: 4, reps: "8", rest: "60s", instruction: "Salte sobre um degrau, banco ou superfície elevada e estável. Desça controlando.", adaptation: "Sem degrau? Faça saltos verticais no lugar, tentando tocar um ponto alto." },
      { name: "Flexão explosiva", sets: 3, reps: "8", rest: "45s", instruction: "Flexão normal, mas empurre com força suficiente para as mãos saírem do chão.", adaptation: "Difícil? Faça com os joelhos apoiados." },
      { name: "Prancha isométrica", sets: 3, reps: "40s", rest: "30s", instruction: "Posição de prancha. Corpo reto da cabeça aos calcanhares. Não deixe o quadril cair." },
    ],
    adaptationNote: "Todos os exercícios usam o peso do corpo. Não precisa de academia ou equipamento.",
    practicalTip: "Priorize a qualidade do movimento e a aterrissagem suave nos saltos para evitar lesões.",
  },
  {
    id: "6",
    title: "Finalização Solo",
    focus: "Chute, precisão e técnica de finalização",
    category: "Técnico",
    duration: "25 min",
    difficulty: "Médio",
    description: "Treine finalização sozinho com bola e alvos improvisados. Foco em potência e precisão.",
    thumbnail: "🎯",
    positions: ["Meia", "Ponta", "Centroavante"],
    solo: true,
    spaceRequired: "amplo",
    material: ["bola"],
    locations: ["quadra", "campo"],
    exercises: [
      { name: "Chute estático ao alvo", sets: 4, reps: "6 chutes", rest: "30s", instruction: "Coloque dois objetos como trave (2m). Chute de 15m mirando nos cantos. Alterne pé direito e esquerdo.", adaptation: "Em espaço menor, chute de 8-10m." },
      { name: "Condução + finalização", sets: 4, reps: "4 vezes", rest: "30s", instruction: "Conduza a bola por 10m e finalize. Simule uma jogada real: receber, dominar, chutar." },
      { name: "Chute de primeira", sets: 3, reps: "6 chutes", rest: "30s", instruction: "Jogue a bola na parede e finalize de primeira na volta. Controle a direção.", adaptation: "Sem parede? Jogue a bola pra cima e chute de voleio ao quicar." },
      { name: "Finalização com giro", sets: 3, reps: "4 cada lado", rest: "30s", instruction: "De costas pro gol, gire 180° e finalize. Simule receber de costas e pivotar." },
      { name: "Penalidade (pressão mental)", sets: 1, reps: "10 cobranças", rest: "—", instruction: "Marque um alvo (canto). Cobre 10 penalidades tentando acertar. Conte seus acertos." },
    ],
    adaptationNote: "Precisa de espaço para chutar. Uma parede firme substitui a trave. Garrafas marcam os cantos.",
    practicalTip: "Foque 70% no pé dominante e 30% no pé fraco. O gol mais importante é o que você faz com confiança.",
  },
  {
    id: "7",
    title: "Jogo Tático Individual",
    focus: "Decisão rápida e transição",
    category: "Tático",
    duration: "20 min",
    difficulty: "Médio",
    description: "Simulação tática individual: deslocamentos, transições e tomada de decisão com exercícios solo.",
    thumbnail: "⚔️",
    positions: ALL_POSITIONS,
    solo: true,
    spaceRequired: "médio",
    material: ["cones"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Triângulo tático", sets: 4, reps: "40s", rest: "20s", instruction: "3 marcadores em triângulo (3m). Corra entre eles simulando: receber, passar, se deslocar.", adaptation: "Use chinelos ou garrafas." },
      { name: "Reação a comando", sets: 5, reps: "20s", rest: "15s", instruction: "Trote no lugar. No bip do celular (use timer), sprint 5m em direção aleatória. Simule reação a jogada." },
      { name: "Pressing solo", sets: 4, reps: "30s", rest: "20s", instruction: "Corra em direção a um marcador, desacelere, reposicione, corra para outro. Simule pressão alta sem bola." },
      { name: "Transição rápida", sets: 4, reps: "30s", rest: "20s", instruction: "Sprint 10m pra frente (ataque), jog de volta (defesa), sprint lateral (cobertura). Repita sem parar." },
    ],
    adaptationNote: "Funciona em 8x8m. Qualquer objeto serve como marcador. O foco é a movimentação inteligente.",
    practicalTip: "Pense no jogo enquanto treina. Cada deslocamento deve ter intenção tática.",
  },
  {
    id: "8",
    title: "Automassagem e Liberação",
    focus: "Liberação miofascial e relaxamento",
    category: "Recuperação",
    duration: "15 min",
    difficulty: "Fácil",
    description: "Liberação miofascial com objetos simples. Reduz dor muscular e acelera recuperação.",
    thumbnail: "❄️",
    positions: ALL_POSITIONS,
    solo: true,
    spaceRequired: "pequeno",
    material: ["básico"],
    locations: ["casa"],
    exercises: [
      { name: "Rolo na panturrilha", sets: 2, reps: "60s cada perna", rest: "10s", instruction: "Use uma garrafa ou rolo. Deslize a panturrilha sobre o objeto, parando nos pontos tensos.", adaptation: "Sem rolo? Use uma bola de tênis ou garrafa pet cheia." },
      { name: "Rolo no quadríceps", sets: 2, reps: "60s cada perna", rest: "10s", instruction: "De bruços, role a parte da frente da coxa sobre o objeto. Vá devagar." },
      { name: "Bolinha no pé", sets: 2, reps: "60s cada pé", rest: "—", instruction: "De pé, role uma bolinha sob a sola do pé com pressão moderada." },
      { name: "Liberação glúteo", sets: 2, reps: "60s cada lado", rest: "10s", instruction: "Sentado sobre a bolinha, cruze a perna e role sobre o glúteo." },
      { name: "Alongamento final leve", sets: 1, reps: "3 min", rest: "—", instruction: "Escolha 3 alongamentos que seu corpo pede. Mantenha cada um por 40s." },
    ],
    adaptationNote: "Uma garrafa pet com água e uma bola de tênis substituem qualquer equipamento profissional.",
    practicalTip: "Respire profundamente durante a liberação. A dor deve ser tolerável — nunca aguda.",
  },
  {
    id: "9",
    title: "Agilidade e Mudança de Direção",
    focus: "Velocidade de reação e coordenação",
    category: "Físico",
    duration: "20 min",
    difficulty: "Médio",
    description: "Drills de agilidade, mudança de direção e coordenação que simulam movimentos reais do jogo.",
    thumbnail: "🔷",
    positions: ["Lateral", "Ponta", "Meia", "Goleiro"],
    solo: true,
    spaceRequired: "médio",
    material: ["cones"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Slalom entre marcadores", sets: 4, reps: "30s", rest: "20s", instruction: "5 marcadores em linha (1,5m entre eles). Corra em zigue-zague o mais rápido possível.", adaptation: "Use garrafas, pedras ou chinelos." },
      { name: "Shuttle run 5-10-5", sets: 4, reps: "1 ida e volta", rest: "30s", instruction: "Corra 5m, toque o chão, volte 10m, toque, volte 5m. Explosão máxima." },
      { name: "Passo cruzado lateral", sets: 3, reps: "20m", rest: "20s", instruction: "Deslocamento lateral cruzando as pernas. Mantenha o centro de gravidade baixo." },
      { name: "T-drill adaptado", sets: 3, reps: "1 vez", rest: "45s", instruction: "Monte um T com 4 marcadores. Sprint frontal 10m, lateral 5m cada lado, volta de costas.", adaptation: "Em espaço menor, reduza para 5m frontal e 3m lateral." },
      { name: "Saltos laterais sobre linha", sets: 3, reps: "20 saltos", rest: "20s", instruction: "Salte lateralmente sobre uma linha no chão, o mais rápido possível. Pés juntos." },
    ],
    adaptationNote: "Precisa de 10x5m no mínimo. Uma calçada reta ou garagem já serve.",
    practicalTip: "Agilidade se treina com qualidade, não cansaço. Descanse o suficiente entre séries.",
  },
  {
    id: "10",
    title: "Passe Longo com Parede",
    focus: "Precisão de passe e visão de jogo",
    category: "Técnico",
    duration: "25 min",
    difficulty: "Difícil",
    description: "Treine passes longos e curtos usando parede como alvo. Desenvolva precisão e força no passe.",
    thumbnail: "🎯",
    positions: ["Zagueiro", "Lateral", "Volante", "Meia"],
    solo: true,
    spaceRequired: "médio",
    material: ["bola"],
    locations: ["quadra", "campo"],
    exercises: [
      { name: "Passe curto na parede", sets: 4, reps: "30s", rest: "15s", instruction: "A 3m da parede, passe e receba com alternância de pés. Controle o primeiro toque." },
      { name: "Passe longo ao alvo", sets: 4, reps: "6 passes", rest: "30s", instruction: "A 20m, mire em um alvo na parede ou entre dois objetos. Alterne pé direito e esquerdo.", adaptation: "Sem 20m? Faça de 10-12m aumentando a velocidade da bola." },
      { name: "Passe e movimentação", sets: 4, reps: "30s", rest: "20s", instruction: "Passe na parede, desloque 3m lateral, receba no novo ponto. Simule passar e se desmarcar." },
      { name: "Lançamento com curva", sets: 3, reps: "6 tentativas", rest: "30s", instruction: "Tente colocar efeito na bola ao passar. Use a parte interna e externa do pé." },
      { name: "Passe sob pressão de tempo", sets: 3, reps: "20s", rest: "20s", instruction: "Passe e receba o mais rápido possível em 20s. Conte quantos toques consegue." },
    ],
    adaptationNote: "Uma parede firme é o melhor parceiro de treino. Se não tiver, treine passe longo em campo aberto mirando em alvos.",
    practicalTip: "O melhor passe é o que chega no companheiro em condição de jogo. Treine pensando no destino.",
  },
  {
    id: "11",
    title: "Marcação e Deslocamento Defensivo",
    focus: "Posicionamento defensivo e desarme",
    category: "Tático",
    duration: "25 min",
    difficulty: "Difícil",
    description: "Treine movimentação defensiva, encaixe de marcação e cobertura sem precisar de adversário.",
    thumbnail: "🛡️",
    positions: ["Zagueiro", "Volante", "Lateral"],
    solo: true,
    spaceRequired: "médio",
    material: ["cones"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Deslocamento lateral defensivo", sets: 4, reps: "30s", rest: "20s", instruction: "Entre dois marcadores (6m), desloque lateralmente em posição defensiva (joelhos flexionados, braços abertos).", adaptation: "Em espaço menor, use 3m." },
      { name: "Recuo + avanço", sets: 4, reps: "8 repetições", rest: "30s", instruction: "Recue 5m de costas e avance 3m em sprint. Simule recuar e atacar a bola." },
      { name: "Giro defensivo 180°", sets: 3, reps: "6 cada lado", rest: "20s", instruction: "Correndo de costas, gire 180° e sprinte 5m. Simule virar para perseguir atacante." },
      { name: "Shadow marking", sets: 4, reps: "30s", rest: "20s", instruction: "Imagine um atacante. Acompanhe-o lateralmente, mantendo posição entre ele e o gol imaginário." },
      { name: "Cabeceio defensivo", sets: 3, reps: "8", rest: "30s", instruction: "Jogue a bola pra cima e cabeceie para frente com potência. Foque em saltar e atacar a bola.", adaptation: "Sem bola? Simule o salto e o movimento de cabeceio." },
    ],
    adaptationNote: "Todo o treino funciona em 10x6m. Os exercícios treinam seu corpo e sua mente defensiva.",
    practicalTip: "Defesa é antecipação. Treine pensando um passo à frente do atacante imaginário.",
  },
  {
    id: "12",
    title: "Yoga para Futebolista",
    focus: "Flexibilidade, equilíbrio e foco mental",
    category: "Recuperação",
    duration: "25 min",
    difficulty: "Fácil",
    description: "Sequência de posturas focada em flexibilidade de quadril, equilíbrio e concentração para atletas.",
    thumbnail: "🧘",
    positions: ALL_POSITIONS,
    solo: true,
    spaceRequired: "pequeno",
    material: ["nenhum"],
    locations: ["casa", "quintal"],
    exercises: [
      { name: "Postura da montanha", sets: 1, reps: "60s", rest: "—", instruction: "De pé, pés juntos, braços ao lado. Respire profundamente e sinta o equilíbrio." },
      { name: "Guerreiro I", sets: 2, reps: "30s cada lado", rest: "10s", instruction: "Passo largo à frente, joelho a 90°. Braços pra cima. Mantenha o quadril alinhado." },
      { name: "Guerreiro III (equilíbrio)", sets: 2, reps: "20s cada perna", rest: "10s", instruction: "Apoie-se em uma perna. Tronco e outra perna formam uma linha horizontal. Foque num ponto fixo." },
      { name: "Pombo (abertura de quadril)", sets: 2, reps: "40s cada lado", rest: "10s", instruction: "Perna da frente cruzada, perna de trás estendida. Incline o tronco à frente. Alongue o quadril profundamente." },
      { name: "Torção sentado", sets: 2, reps: "30s cada lado", rest: "10s", instruction: "Sentado, cruze uma perna sobre a outra e gire o tronco. Mantenha a coluna ereta." },
      { name: "Savasana (relaxamento)", sets: 1, reps: "3 min", rest: "—", instruction: "Deite de barriga pra cima. Braços abertos, palmas pra cima. Relaxe completamente." },
    ],
    adaptationNote: "Precisa apenas de espaço para deitar no chão. Um tapete ou toalha melhora o conforto.",
    practicalTip: "Faça 2x por semana. Flexibilidade de quadril previne lesões e melhora sua movimentação.",
  },
  {
    id: "13",
    title: "Reflexo e Reação de Goleiro",
    focus: "Reflexos, base e explosão lateral",
    category: "Técnico",
    duration: "25 min",
    difficulty: "Difícil",
    description: "Treino solo para goleiros. Trabalhe reflexos, quedas, reação e posicionamento sem precisar de ninguém.",
    thumbnail: "🧤",
    positions: ["Goleiro"],
    solo: true,
    spaceRequired: "médio",
    material: ["bola"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Queda lateral controlada", sets: 4, reps: "6 cada lado", rest: "30s", instruction: "De pé, caia lateralmente controlando o impacto. Mãos posicionadas para defender. Levante rápido." },
      { name: "Bola na parede + defesa", sets: 4, reps: "30s", rest: "30s", instruction: "Jogue a bola forte na parede e defenda a volta. Varie a altura e o ângulo.", adaptation: "Sem parede? Jogue a bola pra cima e salte para pegar." },
      { name: "Reação a quique", sets: 3, reps: "10 bolas", rest: "30s", instruction: "Jogue a bola no chão com força (quique). Reaja e pegue após o quique. Imprevisível = melhor." },
      { name: "Deslocamento entre postes", sets: 4, reps: "30s", rest: "20s", instruction: "2 marcadores a 3m. Desloque-se lateralmente entre eles em posição de base (joelhos flexionados)." },
      { name: "Saída de gol simulada", sets: 3, reps: "6 saídas", rest: "30s", instruction: "Posição de base. Sprint de 3m à frente, simule pegar a bola, volte ao ponto inicial." },
    ],
    adaptationNote: "A parede é seu melhor parceiro. Varie a força e o ângulo para simular chutes reais.",
    practicalTip: "Goleiro se treina todo dia. 15 minutos de reflexo valem mais que 1 hora sem foco.",
  },
  {
    id: "14",
    title: "Subida e Cruzamento Solo",
    focus: "Resistência, projeção e cruzamento",
    category: "Tático",
    duration: "25 min",
    difficulty: "Médio",
    description: "Simule subidas pela lateral, cruzamentos e retorno defensivo. Treino completo para laterais e pontas.",
    thumbnail: "↗️",
    positions: ["Lateral", "Ponta"],
    solo: true,
    spaceRequired: "amplo",
    material: ["bola", "cones"],
    locations: ["quadra", "campo"],
    exercises: [
      { name: "Sprint de subida", sets: 5, reps: "30m", rest: "30s", instruction: "Sprint por 30m simulando subida pela lateral. Toque num marcador e volte trotando.", adaptation: "Em espaço menor, faça 15m ida e volta." },
      { name: "Cruzamento ao alvo", sets: 4, reps: "4 cruzamentos", rest: "30s", instruction: "Conduza a bola e cruze mirando numa área marcada. Alterne rasteiro e alto." },
      { name: "1v1 com cone", sets: 4, reps: "4 vezes", rest: "20s", instruction: "Conduza a bola em direção a um cone, finja um drible e passe ou cruze." },
      { name: "Retorno defensivo", sets: 4, reps: "30s", rest: "20s", instruction: "Sprint de ida, trote de volta simulando retorno defensivo. Mantenha a cabeça alta." },
      { name: "Ida e volta completa", sets: 3, reps: "1 ciclo", rest: "60s", instruction: "Sprint de subida + cruzamento + trote de volta + posição defensiva. Simule 1 jogada completa." },
    ],
    adaptationNote: "Ideal com 30m de extensão. Em espaço menor, reduza distâncias mantendo a intensidade.",
    practicalTip: "Lateral que sobe e não volta é metade do jogador. Treine a volta com a mesma intensidade.",
  },
  {
    id: "15",
    title: "Impulsão e Bola Aérea",
    focus: "Salto, timing e cabeceio",
    category: "Técnico",
    duration: "20 min",
    difficulty: "Médio",
    description: "Treine impulsão vertical, timing de salto e cabeceio ofensivo e defensivo sozinho.",
    thumbnail: "🦅",
    positions: ["Zagueiro", "Centroavante"],
    solo: true,
    spaceRequired: "pequeno",
    material: ["bola"],
    locations: ["quintal", "quadra", "campo"],
    exercises: [
      { name: "Salto vertical máximo", sets: 4, reps: "6", rest: "30s", instruction: "Salte o mais alto possível tentando tocar um ponto alto (galho, trave, parede). Aterrisse suavemente." },
      { name: "Cabeceio para cima", sets: 3, reps: "10", rest: "20s", instruction: "Jogue a bola pra cima e cabeceie repetidamente, mantendo-a no ar. Foque na testa." },
      { name: "Cabeceio com salto", sets: 3, reps: "8", rest: "30s", instruction: "Jogue a bola alta, salte e cabeceie para frente com potência. Ataque a bola." },
      { name: "Timing de corrida + salto", sets: 3, reps: "6", rest: "30s", instruction: "Corra 3m e salte para cabecear uma bola que você joga pra cima antes de correr. Treine o timing." },
      { name: "Pliometria de salto", sets: 3, reps: "8", rest: "30s", instruction: "3 saltos contínuos: vertical, lateral direito, lateral esquerdo. Sem pausa entre eles." },
    ],
    adaptationNote: "Precisa de 3m de espaço e algo alto para mirar. Uma parede ou poste servem de referência.",
    practicalTip: "O cabeceio é 70% posicionamento e timing, 30% força. Treine a corrida de aproximação.",
  },
];

export const positionFilters = ["Todos", "Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Centroavante"] as const;

export const spaceLabels: Record<SpaceRequired, string> = {
  pequeno: "Espaço pequeno",
  médio: "Espaço médio",
  amplo: "Espaço amplo",
};

export const materialLabels: Record<MaterialType, string> = {
  nenhum: "Sem equipamento",
  bola: "Bola",
  cones: "Cones / marcadores",
  elástico: "Elástico",
  básico: "Itens básicos",
};

export const locationLabels: Record<TrainingLocation, string> = {
  casa: "🏠 Casa",
  quintal: "🌿 Quintal",
  quadra: "🏟️ Quadra",
  campo: "⚽ Campo",
  academia: "🏋️ Academia",
};

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
