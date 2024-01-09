export interface Diary {
  id: string;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

export type NonSensitiveDiaryValues = Omit<Diary, 'comment'>;
export type DiaryFormValues = Omit<Diary, 'id'>;
