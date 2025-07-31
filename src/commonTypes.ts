export { type Triplet } from '@pmndrs/cannon-worker-api/src/types.ts';
export type CharactersType = 'Mouch' | 'Moyaki' | 'Molandak' | 'Chog' | 'Salmonad';
export type ValuesType = '0.05' | '0.1' | '0.5' | '1' | '5';
export type ParticipantType = {
  values: ValuesType[];
  totalValue: number;
  color: string;
};
export type ParticipantDataType = Record<string, ParticipantType> | null;
