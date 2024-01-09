import { useState, SyntheticEvent } from 'react';
import diaryService from '../services/diaryService';
import { DiaryFormValues, NonSensitiveDiaryValues } from '../types';

interface Props {
  diaries: NonSensitiveDiaryValues[];
  setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryValues[]>>;
}

const AddDiaryForm = ({ diaries, setDiaries }: Props) => {
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const submitNewDiary = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    const newDiary = await diaryService.createDiary({
      date,
      visibility,
      weather,
      comment
    } as DiaryFormValues);
    setDiaries([...diaries, newDiary]);

    setDate('');
    setVisibility('');
    setWeather('');
    setComment('');
  };

  return (
    <>
      <h2>Add new entry</h2>
      <form onSubmit={submitNewDiary}>
        <div>
          date
          <input
            type="text"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          visibility
          <input
            type="text"
            value={visibility}
            onChange={({ target }) => setVisibility(target.value)}
          />
        </div>
        <div>
          weather
          <input
            type="text"
            value={weather}
            onChange={({ target }) => setWeather(target.value)}
          />
        </div>
        <div>
          comment
          <input
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button>add</button>
      </form>
    </>
  );
};

export default AddDiaryForm;
