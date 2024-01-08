import { CoursePart } from '../types';

interface CoursePartProps {
  part: CoursePart;
}

const Part = (props: CoursePartProps) => {
  const styles: React.CSSProperties = { padding: 3 };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (props.part.kind) {
    case 'basic':
      return (
        <div style={styles}>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>
            <em>{props.part.description}</em>
          </div>
        </div>
      );

    case 'group':
      return (
        <div style={styles}>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>group project count {props.part.groupProjectCount}</div>
        </div>
      );

    case 'background':
      return (
        <div style={styles}>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>
            <em>{props.part.description}</em>
          </div>
          <div>submit to: {props.part.backgroundMaterial}</div>
        </div>
      );

    case 'special':
      return (
        <div style={styles}>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>
            <em>{props.part.description}</em>
          </div>
          <div>required skills: {props.part.requirements.join(', ')}</div>
        </div>
      );

    default:
      assertNever(props.part);
  }
};

export default Part;
