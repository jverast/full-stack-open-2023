import { useEffect, useState } from 'react';
import { NonSensitiveDiaryValues } from './types';

import diaryService from './services/diaryService';

import DiaryList from './components/DiaryList';
import AddDiaryForm from './components/AddDiaryForm';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryValues[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchDiaryList = async () => {
      const diaries = await diaryService.getAll();
      setDiaries(diaries);
    };

    fetchDiaryList();
  }, []);

  return (
    <div className="diary">
      <AddDiaryForm
        diaries={diaries}
        setDiaries={setDiaries}
        setErrorMessage={setMessage}
        message={message}
      />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
