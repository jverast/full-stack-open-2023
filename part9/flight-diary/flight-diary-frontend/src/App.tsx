import { useEffect, useState } from 'react';
import axios from 'axios';

import { NonSensitiveDiaryValues } from './types';
import { apiBaseUrl } from './constants';

import diaryService from './services/diaryService';
import DiaryList from './components/DiaryList';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryValues[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiaryList = async () => {
      const diaries = await diaryService.getAll();
      setDiaries(diaries);
    };

    fetchDiaryList();
  }, []);

  return (
    <div className="diary">
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
