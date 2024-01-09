import { NonSensitiveDiaryValues } from '../types';

interface DiaryProps {
  diary: NonSensitiveDiaryValues;
}

const Diary = (props: DiaryProps) => {
  return (
    <div className="diary">
      <h3>{props.diary.date}</h3>
      <div>visibility: {props.diary.visibility}</div>
      <div>weather: {props.diary.weather}</div>
    </div>
  );
};

export default Diary;
