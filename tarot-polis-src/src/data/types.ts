export interface CardInterpretations {
  Arrien?: string;
  Cowie?: string;
  Crowley?: string;
  Eakins?: string;
  Fairfield?: string;
  Greer?: string;
  Noble?: string;
  Pollack?: string;
  "Sharman-Burke"?: string;
  Stewart?: string;
  Waite?: string;
  Walker?: string;
  Wanless?: string;
  Wirth?: string;
  Riley?: string;
}

export type TarotDictionary = Record<string, CardInterpretations>;

export interface Author {
  id: string;
  name: string;
  description: string;
}

export const AUTHORS: Author[] = [
  { id: "Arrien", name: "Angeles Arrien", description: "Princípios e Arquétipos" },
  { id: "Cowie", name: "Norma Cowie", description: "Orientação Espiritual Prática" },
  { id: "Crowley", name: "Aleister Crowley", description: "Tradição Hermética/Esotérica" },
  { id: "Eakins", name: "Pamela Eakins", description: "Consciência e Transformação" },
  { id: "Fairfield", name: "Gail Fairfield", description: "Energia e Consciência" },
  { id: "Greer", name: "Mary K. Greer", description: "Princípios Arquetípicos" },
  { id: "Noble", name: "Vicki Noble", description: "Sombra e Transformação" },
  { id: "Pollack", name: "Rachel Pollack", description: "Dimensões Psicológicas" },
  { id: "Sharman-Burke", name: "Juliet Sharman-Burke", description: "Significados Simbólicos Tradicionais" },
  { id: "Stewart", name: "R.J. Stewart", description: "Trabalho de Energia Espiritual" },
  { id: "Waite", name: "Arthur Edward Waite", description: "Tradição Esotérica Ocidental" },
  { id: "Walker", name: "Barbara Walker", description: "Mitologia e Deusa" },
  { id: "Wanless", name: "James Wanless", description: "Leis Universais" },
  { id: "Wirth", name: "Oswald Wirth", description: "Perspectivas Iniciáticas" },
  { id: "Riley", name: "Jana Riley", description: "Mensagens de Orientação Espiritual" },
];

export const MAJOR_ARCANA = [
  "O Louco",
  "O Mago",
  "A Sacerdotisa",
  "A Imperatriz",
  "O Imperador",
  "O Hierofante",
  "Os Amantes",
  "O Carro",
  "A Justiça",
  "O Eremita",
  "A Roda da Fortuna",
  "A Força",
  "O Enforcado",
  "A Morte",
  "A Temperança",
  "O Diabo",
  "A Torre",
  "A Estrela",
  "A Lua",
  "O Sol",
  "O Julgamento",
  "O Mundo",
];

export const COPAS = [
  "Ás de Copas",
  "2 de Copas",
  "3 de Copas",
  "4 de Copas",
  "5 de Copas",
  "6 de Copas",
  "7 de Copas",
  "8 de Copas",
  "9 de Copas",
  "10 de Copas",
  "Valete de Copas",
  "Cavaleiro de Copas",
  "Rainha de Copas",
  "Rei de Copas",
];

export const OUROS = [
  "Ás de Ouros",
  "2 de Ouros",
  "3 de Ouros",
  "4 de Ouros",
  "5 de Ouros",
  "6 de Ouros",
  "7 de Ouros",
  "8 de Ouros",
  "9 de Ouros",
  "10 de Ouros",
  "Valete de Ouros",
  "Cavaleiro de Ouros",
  "Rainha de Ouros",
  "Rei de Ouros",
];

export const PAUS = [
  "Ás de Paus",
  "2 de Paus",
  "3 de Paus",
  "4 de Paus",
  "5 de Paus",
  "6 de Paus",
  "7 de Paus",
  "8 de Paus",
  "9 de Paus",
  "10 de Paus",
  "Valete de Paus",
  "Cavaleiro de Paus",
  "Rainha de Paus",
  "Rei de Paus",
];

export const ESPADAS = [
  "Ás de Espadas",
  "2 de Espadas",
  "3 de Espadas",
  "4 de Espadas",
  "5 de Espadas",
  "6 de Espadas",
  "7 de Espadas",
  "8 de Espadas",
  "9 de Espadas",
  "10 de Espadas",
  "Valete de Espadas",
  "Cavaleiro de Espadas",
  "Rainha de Espadas",
  "Rei de Espadas",
];

export const MINOR_ARCANA = [...COPAS, ...OUROS, ...PAUS, ...ESPADAS];

export const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const CARD_NUMBERS: Record<string, string> = {
  // Major Arcana
  "O Louco": "0",
  "O Mago": "I",
  "A Sacerdotisa": "II",
  "A Imperatriz": "III",
  "O Imperador": "IV",
  "O Hierofante": "V",
  "Os Amantes": "VI",
  "O Carro": "VII",
  "A Justiça": "VIII",
  "O Eremita": "IX",
  "A Roda da Fortuna": "X",
  "A Força": "XI",
  "O Enforcado": "XII",
  "A Morte": "XIII",
  "A Temperança": "XIV",
  "O Diabo": "XV",
  "A Torre": "XVI",
  "A Estrela": "XVII",
  "A Lua": "XVIII",
  "O Sol": "XIX",
  "O Julgamento": "XX",
  "O Mundo": "XXI",
  // Copas
  "Ás de Copas": "A",
  "2 de Copas": "2",
  "3 de Copas": "3",
  "4 de Copas": "4",
  "5 de Copas": "5",
  "6 de Copas": "6",
  "7 de Copas": "7",
  "8 de Copas": "8",
  "9 de Copas": "9",
  "10 de Copas": "10",
  "Valete de Copas": "V",
  "Cavaleiro de Copas": "C",
  "Rainha de Copas": "R",
  "Rei de Copas": "K",
  // Ouros
  "Ás de Ouros": "A",
  "2 de Ouros": "2",
  "3 de Ouros": "3",
  "4 de Ouros": "4",
  "5 de Ouros": "5",
  "6 de Ouros": "6",
  "7 de Ouros": "7",
  "8 de Ouros": "8",
  "9 de Ouros": "9",
  "10 de Ouros": "10",
  "Valete de Ouros": "V",
  "Cavaleiro de Ouros": "C",
  "Rainha de Ouros": "R",
  "Rei de Ouros": "K",
  // Paus
  "Ás de Paus": "A",
  "2 de Paus": "2",
  "3 de Paus": "3",
  "4 de Paus": "4",
  "5 de Paus": "5",
  "6 de Paus": "6",
  "7 de Paus": "7",
  "8 de Paus": "8",
  "9 de Paus": "9",
  "10 de Paus": "10",
  "Valete de Paus": "V",
  "Cavaleiro de Paus": "C",
  "Rainha de Paus": "R",
  "Rei de Paus": "K",
  // Espadas
  "Ás de Espadas": "A",
  "2 de Espadas": "2",
  "3 de Espadas": "3",
  "4 de Espadas": "4",
  "5 de Espadas": "5",
  "6 de Espadas": "6",
  "7 de Espadas": "7",
  "8 de Espadas": "8",
  "9 de Espadas": "9",
  "10 de Espadas": "10",
  "Valete de Espadas": "V",
  "Cavaleiro de Espadas": "C",
  "Rainha de Espadas": "R",
  "Rei de Espadas": "K",
};

export type Suit = "copas" | "ouros" | "paus" | "espadas";

export const SUIT_INFO: Record<Suit, { name: string; color: string; element: string }> = {
  copas: { name: "Copas", color: "#3b82f6", element: "Água" },
  ouros: { name: "Ouros", color: "#eab308", element: "Terra" },
  paus: { name: "Paus", color: "#ef4444", element: "Fogo" },
  espadas: { name: "Espadas", color: "#a1a1aa", element: "Ar" },
};

export function getCardSuit(cardName: string): Suit | null {
  if (cardName.includes("Copas")) return "copas";
  if (cardName.includes("Ouros")) return "ouros";
  if (cardName.includes("Paus")) return "paus";
  if (cardName.includes("Espadas")) return "espadas";
  return null;
}

export function isMajorArcana(cardName: string): boolean {
  return MAJOR_ARCANA.includes(cardName);
}
