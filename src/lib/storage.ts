export interface Athlete {
  name: string;
  email: string;
  position: string;
  age: number;
  level: "Iniciante" | "Titular" | "Estrela";
  trainingsThisWeek: number;
  totalTrainings: number;
  physicalLevel: number;
  daysUntilGame: number;
  plan: string[];
  assessments: Assessment[];
  evolutionData: number[];
}

export interface Assessment {
  date: string;
  imc: number;
  fatPercentage: number;
  run12min: number;
  sprint30m: number;
  category: "Elite" | "Bom" | "Desenvolver";
}

const STORAGE_KEY = "profutebolsm_athlete";

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage full or blocked
  }
}

export function getAthlete(): Athlete | null {
  const data = safeGetItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveAthlete(athlete: Athlete): void {
  safeSetItem(STORAGE_KEY, JSON.stringify(athlete));
}

export function clearAthlete(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function createAthlete(name: string, email: string, position: string, age: number): Athlete {
  return {
    name,
    email,
    position,
    age,
    level: "Iniciante",
    trainingsThisWeek: 0,
    totalTrainings: 0,
    physicalLevel: 75,
    daysUntilGame: 3,
    plan: [],
    assessments: [],
    evolutionData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 50),
  };
}

export function calculateLevel(totalTrainings: number): Athlete["level"] {
  if (totalTrainings >= 50) return "Estrela";
  if (totalTrainings >= 20) return "Titular";
  return "Iniciante";
}
