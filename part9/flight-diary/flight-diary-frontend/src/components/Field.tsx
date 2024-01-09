interface Props {
  id?: string;
  name?: string;
  type: string;
  value: string;
  onChange: (event: { target: HTMLInputElement }) => void;
}

const Field = ({ value, type, id, name, onChange }: Props) => {
  return (
    <>
      <label htmlFor={id}>{id}</label>
      {id ? (
        <input
          id={id}
          type={type}
          value={value}
          checked={value === id}
          name={name}
          onChange={onChange}
        />
      ) : (
        <input type={type} value={value} onChange={onChange} />
      )}
    </>
  );
};

export default Field;
