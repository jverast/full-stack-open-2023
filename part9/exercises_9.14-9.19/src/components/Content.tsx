interface Parts {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  parts: Parts[];
}

const Content = (props: ContentProps) => {
  return (
    <>
      {props.parts.map((part) => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
