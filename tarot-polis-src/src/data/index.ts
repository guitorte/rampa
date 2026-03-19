import type { TarotDictionary, CardInterpretations } from "./types";
import tarotData from "./tarot_dic.json";

export * from "./types";

type RawAuthorEntry = { significado?: string; [key: string]: unknown };
type RawEntry = { carta: string; autores: Record<string, RawAuthorEntry> };

export const tarotDictionary: TarotDictionary = Object.fromEntries(
  (tarotData as unknown as RawEntry[]).map(({ carta, autores }) => {
    const interpretations: CardInterpretations = {};
    for (const [authorId, entry] of Object.entries(autores)) {
      if (entry?.significado) {
        (interpretations as Record<string, string>)[authorId] = entry.significado;
      }
    }
    return [carta, interpretations];
  })
);

export function getCardNames(): string[] {
  return Object.keys(tarotDictionary);
}

export function getCardInterpretation(cardName: string) {
  return tarotDictionary[cardName];
}

export function searchCards(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  return Object.keys(tarotDictionary).filter((card) =>
    card.toLowerCase().includes(lowerQuery)
  );
}
