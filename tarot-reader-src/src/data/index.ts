import type { TarotCard, DynamicKey } from "./types";
import tarotData from "./tarot_data_full.json";

export * from "./types";

const cards: TarotCard[] = tarotData as TarotCard[];

// Index by name for O(1) lookup
const cardsByName = new Map<string, TarotCard>();
for (const card of cards) {
  cardsByName.set(card.name, card);
}

// Index by id for O(1) lookup
const cardsById = new Map<string, TarotCard>();
for (const card of cards) {
  cardsById.set(card.id, card);
}

export function getAllCards(): TarotCard[] {
  return cards;
}

export function getAllCardNames(): string[] {
  return cards.map((c) => c.name);
}

export function getCardByName(name: string): TarotCard | undefined {
  return cardsByName.get(name);
}

export function getCardById(id: string): TarotCard | undefined {
  return cardsById.get(id);
}

export function searchCards(query: string): string[] {
  const lower = query.toLowerCase();
  return cards.filter((c) => c.name.toLowerCase().includes(lower)).map((c) => c.name);
}

export function getInteraction(
  card1Name: string,
  card2Name: string,
): Record<DynamicKey, string> | null {
  const card = cardsByName.get(card1Name);
  if (!card) return null;

  const card2 = cardsByName.get(card2Name);
  if (!card2) return null;

  const interaction = card.interactions.find((i) => i.target_id === card2.id);
  if (!interaction) return null;

  return interaction.dynamics;
}

// Card groupings matching the JSON data
export const COPAS = [
  "As de Copas", "2 de Copas", "3 de Copas", "4 de Copas",
  "5 de Copas", "6 de Copas", "7 de Copas", "8 de Copas",
  "9 de Copas", "10 de Copas", "Pajem de Copas",
  "Cavaleiro de Copas", "Rainha de Copas", "Rei de Copas",
];

export const PAUS = [
  "As de Paus", "2 de Paus", "3 de Paus", "4 de Paus",
  "5 de Paus", "6 de Paus", "7 de Paus", "8 de Paus",
  "9 de Paus", "10 de Paus", "Pajem de Paus",
  "Cavaleiro de Paus", "Rainha de Paus", "Rei de Paus",
];

export const ESPADAS = [
  "As de Espadas", "2 de Espadas", "3 de Espadas", "4 de Espadas",
  "5 de Espadas", "6 de Espadas", "7 de Espadas", "8 de Espadas",
  "9 de Espadas", "10 de Espadas", "Pajem de Espadas",
  "Cavaleiro de Espadas", "Rainha de Espadas", "Rei de Espadas",
];

export const OUROS = [
  "As de Ouros", "2 de Ouros", "3 de Ouros", "4 de Ouros",
  "5 de Ouros", "6 de Ouros", "7 de Ouros", "8 de Ouros",
  "9 de Ouros", "10 de Ouros", "Pajem de Ouros",
  "Cavaleiro de Ouros", "Rainha de Ouros", "Rei de Ouros",
];

export const MAJOR_ARCANA = [
  "O Mago", "A Papisa", "A Imperatriz", "O Imperador", "O Papa",
  "O Amante", "O Carro", "A Justica", "O Eremita", "A Roda da Fortuna",
  "A Forca", "O Enforcado", "A Morte", "Temperanca", "O Diabo",
  "A Casa Deus", "A Estrela", "A Lua", "O Sol", "O Julgamento",
  "O Mundo", "O Louco",
];
