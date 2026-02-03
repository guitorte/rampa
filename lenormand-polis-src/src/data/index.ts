import type { LenormandDictionary, LenormandCard, Context } from "./types";
import lenormandData from "./lenormand_dic.json";

export * from "./types";

export const lenormandDictionary: LenormandDictionary =
  lenormandData as LenormandDictionary;

export function getCardNames(): string[] {
  return Object.keys(lenormandDictionary);
}

export function getCard(cardName: string): LenormandCard | undefined {
  return lenormandDictionary[cardName];
}

export function getCardInterpretations(cardName: string): Record<string, string> | undefined {
  const card = lenormandDictionary[cardName];
  return card?.significados;
}

export function getCardInContext(
  cardName: string,
  context: Context
): string | undefined {
  const card = lenormandDictionary[cardName];
  return card?.contextos?.[context];
}

export function searchCards(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  return Object.keys(lenormandDictionary).filter((card) => {
    const cardData = lenormandDictionary[card];
    return (
      card.toLowerCase().includes(lowerQuery) ||
      cardData.nome_en.toLowerCase().includes(lowerQuery) ||
      cardData.palavras_chave.some((kw) => kw.toLowerCase().includes(lowerQuery))
    );
  });
}

export function getCardKeywords(cardName: string): string[] {
  const card = lenormandDictionary[cardName];
  return card?.palavras_chave || [];
}

export function getCardCombination(
  cardName: string,
  withCard: string
): string | undefined {
  const card = lenormandDictionary[cardName];
  if (!card?.combinacoes_notaveis) return undefined;

  // Try to find a combination mentioning the other card
  for (const [combo, meaning] of Object.entries(card.combinacoes_notaveis)) {
    if (combo.includes(withCard.replace(/^\d+\.\s*/, ""))) {
      return meaning;
    }
  }
  return undefined;
}

// Generate a combination interpretation based on card roles
export function generateCombinationInterpretation(
  card1: string,
  card2: string
): string {
  const c1 = lenormandDictionary[card1];
  const c2 = lenormandDictionary[card2];

  if (!c1 || !c2) return "Combinação não disponível";

  // Check for documented combination
  const documented = getCardCombination(card1, card2) || getCardCombination(card2, card1);
  if (documented) return documented;

  // Generate based on grammatical roles
  // card1 as noun/subject + card2 as adjective/modifier
  return `${c1.como_sujeito} que é ${c2.como_adjetivo.toLowerCase()}, ou ${c2.como_sujeito} ${c1.como_verbo.toLowerCase()}.`;
}
