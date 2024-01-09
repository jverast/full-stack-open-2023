import { SyntheticEvent } from 'react';
import axios from 'axios';
import diaryService from '../services/diaryService';
import { NonSensitiveDiaryValues } from '../types';
import Notify from './Notify';
import Field from './Field';

import { useField } from '../hooks';

import styled from 'styled-components';

interface Props {
  diaries: NonSensitiveDiaryValues[];
  setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryValues[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
}

const FieldContainer = styled.div`
  & > span {
    margin-right: 0.75rem;
  }
`;

const AddDiaryForm = ({
  diaries,
  setDiaries,
  setErrorMessage,
  message
}: Props) => {
  const { reset: resetDate, ...date } = useField('date');
  const { reset: resetVisibility, ...visibility } = useField('radio');
  const { reset: resetWeather, ...weather } = useField('radio');
  const { reset: resetComment, ...comment } = useField('text');

  const submitNewDiary = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    try {
      const newDiary = await diaryService.createDiary({
        date: date.value,
        visibility: visibility.value,
        weather: weather.value,
        comment: comment.value
      });
      setDiaries([...diaries, newDiary]);

      resetDate();
      resetVisibility();
      resetWeather();
      resetComment();
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
        <FieldContainer>
          <span>date</span>
          <Field {...date} />
        </FieldContainer>
        <FieldContainer>
          <span>visibility</span>
          <Field id="great" name="visibility" {...visibility} />
          <Field id="good" name="visibility" {...visibility} />
          <Field id="ok" name="visibility" {...visibility} />
          <Field id="poor" name="visibility" {...visibility} />
        </FieldContainer>
        <FieldContainer>
          <span>weather</span>
          <Field id="sunny" name="weather" {...weather} />
          <Field id="rainy" name="weather" {...weather} />
          <Field id="cloudy" name="weather" {...weather} />
          <Field id="stormy" name="weather" {...weather} />
          <Field id="windy" name="weather" {...weather} />
        </FieldContainer>
        <FieldContainer>
          <span>comment</span>
          <Field {...comment} />
        </FieldContainer>
        <button>add</button>
      </form>
    </>
  );
};

export default AddDiaryForm;
