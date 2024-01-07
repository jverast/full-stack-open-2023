import diagnoseEntries from '../../data/diagnoseEntries';
import { Diagnose } from '../types';

const getEntries = (): Diagnose[] => {
  return diagnoseEntries;
};

export default { getEntries };
