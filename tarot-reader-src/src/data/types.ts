export type DynamicKey = "engendrar" | "conflito" | "estagnar" | "regressar" | "necessitar";

export interface DynamicInfo {
  id: DynamicKey;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
}

export interface Interaction {
  target_id: string;
  target_name: string;
  dynamics: Record<DynamicKey, string>;
}

export interface TarotCard {
  id: string;
  name: string;
  interactions: Interaction[];
}

export type Suit = "copas" | "ouros" | "paus" | "espadas";

export const DYNAMICS_ORDER: DynamicKey[] = [
  "engendrar",
  "conflito",
  "estagnar",
  "regressar",
  "necessitar",
];

export const DYNAMICS_INFO: Record<DynamicKey, DynamicInfo> = {
  engendrar: {
    id: "engendrar",
    name: "Engendrar",
    subtitle: "Geração",
    icon: "✦",
    color: "#6aaa8c",
    description: "A força criativa que emerge do encontro entre estas cartas",
  },
  conflito: {
    id: "conflito",
    name: "Conflito",
    subtitle: "Tensão",
    icon: "⚔",
    color: "#c27171",
    description: "As tensões e contradições que surgem neste par",
  },
  estagnar: {
    id: "estagnar",
    name: "Estagnar",
    subtitle: "Paralisia",
    icon: "◯",
    color: "#7b7fb5",
    description: "Os padrões de estagnação e bloqueio desta combinação",
  },
  regressar: {
    id: "regressar",
    name: "Regressar",
    subtitle: "Retorno",
    icon: "↺",
    color: "#c4943e",
    description: "O movimento de retorno e revisão que se manifesta",
  },
  necessitar: {
    id: "necessitar",
    name: "Necessitar",
    subtitle: "Carência",
    icon: "∞",
    color: "#5ea0a8",
    description: "O que uma carta precisa da outra para evoluir",
  },
};

export const SUIT_INFO: Record<Suit, { name: string; color: string; element: string }> = {
  copas:   { name: "Copas",   color: "#7090b8", element: "Água" },
  ouros:   { name: "Ouros",   color: "#b8993a", element: "Terra" },
  paus:    { name: "Paus",    color: "#b06060", element: "Fogo" },
  espadas: { name: "Espadas", color: "#8a8a9a", element: "Ar" },
};

export const MAJOR_ARCANA_NAMES = [
  "O Mago", "A Papisa", "A Imperatriz", "O Imperador", "O Papa",
  "O Amante", "O Carro", "A Justica", "O Eremita", "A Roda da Fortuna",
  "A Forca", "O Enforcado", "A Morte", "Temperanca", "O Diabo",
  "A Casa Deus", "A Estrela", "A Lua", "O Sol", "O Julgamento",
  "O Mundo", "O Louco",
];

export const CARD_NUMBERS: Record<string, string> = {
  "O Mago": "I", "A Papisa": "II", "A Imperatriz": "III", "O Imperador": "IV",
  "O Papa": "V", "O Amante": "VI", "O Carro": "VII", "A Justica": "VIII",
  "O Eremita": "IX", "A Roda da Fortuna": "X", "A Forca": "XI",
  "O Enforcado": "XII", "A Morte": "XIII", "Temperanca": "XIV",
  "O Diabo": "XV", "A Casa Deus": "XVI", "A Estrela": "XVII",
  "A Lua": "XVIII", "O Sol": "XIX", "O Julgamento": "XX",
  "O Mundo": "XXI", "O Louco": "0",
  // Copas
  "As de Copas": "A", "2 de Copas": "2", "3 de Copas": "3", "4 de Copas": "4",
  "5 de Copas": "5", "6 de Copas": "6", "7 de Copas": "7", "8 de Copas": "8",
  "9 de Copas": "9", "10 de Copas": "10", "Pajem de Copas": "P",
  "Cavaleiro de Copas": "C", "Rainha de Copas": "R", "Rei de Copas": "K",
  // Paus
  "As de Paus": "A", "2 de Paus": "2", "3 de Paus": "3", "4 de Paus": "4",
  "5 de Paus": "5", "6 de Paus": "6", "7 de Paus": "7", "8 de Paus": "8",
  "9 de Paus": "9", "10 de Paus": "10", "Pajem de Paus": "P",
  "Cavaleiro de Paus": "C", "Rainha de Paus": "R", "Rei de Paus": "K",
  // Espadas
  "As de Espadas": "A", "2 de Espadas": "2", "3 de Espadas": "3", "4 de Espadas": "4",
  "5 de Espadas": "5", "6 de Espadas": "6", "7 de Espadas": "7", "8 de Espadas": "8",
  "9 de Espadas": "9", "10 de Espadas": "10", "Pajem de Espadas": "P",
  "Cavaleiro de Espadas": "C", "Rainha de Espadas": "R", "Rei de Espadas": "K",
  // Ouros
  "As de Ouros": "A", "2 de Ouros": "2", "3 de Ouros": "3", "4 de Ouros": "4",
  "5 de Ouros": "5", "6 de Ouros": "6", "7 de Ouros": "7", "8 de Ouros": "8",
  "9 de Ouros": "9", "10 de Ouros": "10", "Pajem de Ouros": "P",
  "Cavaleiro de Ouros": "C", "Rainha de Ouros": "R", "Rei de Ouros": "K",
};

export function getCardSuit(cardName: string): Suit | null {
  if (cardName.includes("Copas")) return "copas";
  if (cardName.includes("Ouros")) return "ouros";
  if (cardName.includes("Paus")) return "paus";
  if (cardName.includes("Espadas")) return "espadas";
  return null;
}

export function isMajorArcana(cardName: string): boolean {
  return MAJOR_ARCANA_NAMES.includes(cardName);
}

export function getCardColor(cardName: string): string {
  if (isMajorArcana(cardName)) return "#a855f7";
  const suit = getCardSuit(cardName);
  if (suit) return SUIT_INFO[suit].color;
  return "#a1a1aa";
}
