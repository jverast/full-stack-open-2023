import Part from './Part';
import { CoursePart } from '../types';

interface ContentProps {
  parts: CoursePart[];
}

const Content = (props: ContentProps) => {
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 10
  };

  return (
    <div style={styles}>
      {props.parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

export default Content;
