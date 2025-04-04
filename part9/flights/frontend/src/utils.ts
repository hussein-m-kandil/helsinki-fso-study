import { DiaryEntry, Visibility, Weather } from './types';

export const isDiaryEntry = (entry: unknown): entry is DiaryEntry => {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'id' in entry &&
    'date' in entry &&
    'weather' in entry &&
    'visibility' in entry &&
    Object.values(Weather)
      .map((w) => String(w))
      .includes(String(entry.weather)) &&
    Object.values(Visibility)
      .map((v) => String(v))
      .includes(String(entry.visibility))
  );
};

export const isDiaryEntryArray = (arr: unknown): arr is DiaryEntry[] => {
  return Array.isArray(arr) && arr.length > 0 && arr.every(isDiaryEntry);
};
