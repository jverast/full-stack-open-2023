import { NonSensitiveDiaryValues } from '../types';
import Diary from './Diary';

interface DiariesProps {
  diaries: NonSensitiveDiaryValues[];
}

const DiaryList = (props: DiariesProps) => {
  return (
    <section className="diary-entries">
      <h2>Diary entries</h2>
      {props.diaries.map((diary) => (
        <Diary key={diary.id} diary={diary} />
      ))}
    </section>
  );
};

export default DiaryList;
