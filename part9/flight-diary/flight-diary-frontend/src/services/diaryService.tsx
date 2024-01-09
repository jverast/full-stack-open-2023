import axios from 'axios';
import { Diary, DiaryFormValues, NonSensitiveDiaryValues } from '../types';
import { apiBaseUrl } from '../constants';

const getAll = async (): Promise<NonSensitiveDiaryValues[]> => {
  const response = await axios.get(`${apiBaseUrl}/diaries`);
  return response.data;
};

const createDiary = async (diary: DiaryFormValues): Promise<Diary> => {
  const response = await axios.post(`${apiBaseUrl}/diaries`, diary);
  return response.data;
};

export default { getAll, createDiary };
