import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Diagnose } from '../types';

const getAll = async (): Promise<Diagnose[]> => {
  const { data } = await axios.get<Diagnose[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

export default { getAll };
