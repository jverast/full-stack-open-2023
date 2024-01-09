interface Props {
  message: string;
  variant?: string;
}

const Notify = ({ message, variant = 'error' }: Props) => {
  return (
    <p style={{ color: variant === 'error' ? 'red' : 'green' }}>{message}</p>
  );
};

export default Notify;
