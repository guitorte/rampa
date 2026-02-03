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

export const CARD_NUMBERS: Record<string, string> = {
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
};
