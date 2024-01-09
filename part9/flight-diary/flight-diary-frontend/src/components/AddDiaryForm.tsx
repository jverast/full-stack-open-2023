import { useState, SyntheticEvent } from 'react';
import diaryService from '../services/diaryService';
import { NonSensitiveDiaryValues } from '../types';
import axios from 'axios';
import Notify from './Notify';

interface Props {
  diaries: NonSensitiveDiaryValues[];
  setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryValues[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
}

const AddDiaryForm = ({
  diaries,
  setDiaries,
  setErrorMessage,
  message
}: Props) => {
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const submitNewDiary = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    try {
      const newDiary = await diaryService.createDiary({
        date,
        visibility,
        weather,
        comment
      });
      setDiaries([...diaries, newDiary]);

      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data && typeof error.response.data === 'string') {
          showMessage(error.response.data.substring(21));
        } else {
          showMessage('Unrecognized axios error');
          console.error(error);
        }
      } else {
        showMessage('Unknown error');
        console.error(error);
      }
    }
  };

  const showMessage = (message: string): void => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  return (
    <>
      <h2>Add new entry</h2>
      <Notify message={message} />
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
