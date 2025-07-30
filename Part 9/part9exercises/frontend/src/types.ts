export const WEATHER_VALUES = [
  'sunny',
  'rainy',
  'cloudy',
  'stormy',
  'windy',
] as const;
export const VISIBILITY_VALUES = ['great', 'good', 'ok', 'poor'] as const;

export type Weather = (typeof WEATHER_VALUES)[number];
export type Visibility = (typeof VISIBILITY_VALUES)[number];

export type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
};

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
