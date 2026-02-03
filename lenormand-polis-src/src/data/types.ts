export interface CardContexts {
  amor: string;
  trabalho: string;
  saude: string;
  dinheiro: string;
}

export interface LenormandCard {
  numero: number;
  nome_en: string;
  simbolo: string;
  elemento: string;
  tempo: string;
  palavras_chave: string[];
  significados: Record<string, string>;
  como_sujeito: string;
  como_verbo: string;
  como_adjetivo: string;
  contextos: CardContexts;
  combinacoes_notaveis?: Record<string, string>;
  nota?: string;
}

export type LenormandDictionary = Record<string, LenormandCard>;

export interface Author {
  id: string;
  name: string;
  tradition: string;
  description: string;
}

export const AUTHORS: Author[] = [
  {
    id: "Rana George",
    name: "Rana George",
    tradition: "Moderna/Libanesa",
    description: "Autora de 'The Complete Lenormand Oracle Handbook', uma das principais referências modernas",
  },
  {
    id: "Caitlín Matthews",
    name: "Caitlín Matthews",
    tradition: "Celta/Britânica",
    description: "Autora de 'The Complete Lenormand', combina tradição com espiritualidade celta",
  },
  {
    id: "Andy Boroveshengra",
    name: "Andy Boroveshengra",
    tradition: "Moderna/Internacional",
    description: "Autor de 'Lenormand Thirty Six Cards', abordagem prática e direta",
  },
  {
    id: "Tradição Alemã",
    name: "Tradição Alemã",
    tradition: "Kartenlegen",
    description: "A tradição original do Petit Lenormand, berço do baralho",
  },
  {
    id: "Tradição Brasileira",
    name: "Tradição Brasileira",
    tradition: "Baralho Cigano",
    description: "Adaptação brasileira com influências ciganas e espíritas",
  },
];

export const ALL_CARDS = [
  "1. Cavaleiro",
  "2. Trevo",
  "3. Navio",
  "4. Casa",
  "5. Árvore",
  "6. Nuvens",
  "7. Cobra",
  "8. Caixão",
  "9. Buquê",
  "10. Foice",
  "11. Chicote",
  "12. Pássaros",
  "13. Criança",
  "14. Raposa",
  "15. Urso",
  "16. Estrela",
  "17. Cegonha",
  "18. Cachorro",
  "19. Torre",
  "20. Jardim",
  "21. Montanha",
  "22. Caminhos",
  "23. Ratos",
  "24. Coração",
  "25. Anel",
  "26. Livro",
  "27. Carta",
  "28. Homem",
  "29. Mulher",
  "30. Lírios",
  "31. Sol",
  "32. Lua",
  "33. Chave",
  "34. Peixes",
  "35. Âncora",
  "36. Cruz",
];

export const CARD_CATEGORIES: Record<string, string[]> = {
  "Cartas Positivas": [
    "2. Trevo",
    "9. Buquê",
    "16. Estrela",
    "17. Cegonha",
    "18. Cachorro",
    "24. Coração",
    "31. Sol",
    "33. Chave",
  ],
  "Cartas Negativas": [
    "6. Nuvens",
    "7. Cobra",
    "8. Caixão",
    "10. Foice",
    "21. Montanha",
    "23. Ratos",
    "36. Cruz",
  ],
  "Cartas Neutras": [
    "1. Cavaleiro",
    "3. Navio",
    "4. Casa",
    "5. Árvore",
    "11. Chicote",
    "12. Pássaros",
    "13. Criança",
    "14. Raposa",
    "15. Urso",
    "19. Torre",
    "20. Jardim",
    "22. Caminhos",
    "25. Anel",
    "26. Livro",
    "27. Carta",
    "28. Homem",
    "29. Mulher",
    "30. Lírios",
    "32. Lua",
    "34. Peixes",
    "35. Âncora",
  ],
  Pessoas: [
    "7. Cobra",
    "13. Criança",
    "14. Raposa",
    "15. Urso",
    "18. Cachorro",
    "28. Homem",
    "29. Mulher",
  ],
  Tempo: [
    "1. Cavaleiro",
    "2. Trevo",
    "5. Árvore",
    "31. Sol",
    "32. Lua",
  ],
  Comunicação: [
    "1. Cavaleiro",
    "12. Pássaros",
    "27. Carta",
  ],
};

export type Context = "amor" | "trabalho" | "saude" | "dinheiro";

export const CONTEXTS: { id: Context; label: string; icon: string }[] = [
  { id: "amor", label: "Amor", icon: "❤️" },
  { id: "trabalho", label: "Trabalho", icon: "💼" },
  { id: "saude", label: "Saúde", icon: "🏥" },
  { id: "dinheiro", label: "Dinheiro", icon: "💰" },
];

export function getCardNumber(cardName: string): number {
  const match = cardName.match(/^(\d+)\./);
  return match ? parseInt(match[1]) : 0;
}

export function getCardShortName(cardName: string): string {
  return cardName.replace(/^\d+\.\s*/, "");
}

export function isPositiveCard(cardName: string): boolean {
  return CARD_CATEGORIES["Cartas Positivas"].includes(cardName);
}

export function isNegativeCard(cardName: string): boolean {
  return CARD_CATEGORIES["Cartas Negativas"].includes(cardName);
}

export function isPersonCard(cardName: string): boolean {
  return CARD_CATEGORIES["Pessoas"].includes(cardName);
}
