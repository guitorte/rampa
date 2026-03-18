import type { TarotDictionary } from "./types";
import tarotData from "./tarot_dic.json";

export * from "./types";

type RawEntry = { carta: string; autores: TarotDictionary[string] };

export const tarotDictionary: TarotDictionary = Object.fromEntries(
  (tarotData as unknown as RawEntry[]).map(({ carta, autores }) => [carta, autores])
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
