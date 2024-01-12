import { Alert } from '@mui/material';

interface Props {
  message: string;
  variant?: string;
}

const Notify = ({ message, variant = 'error' }: Props) => {
  if (!message) return null;

  return (
    <Alert severity={variant === 'error' ? 'error' : 'success'}>
      {message}
    </Alert>
  );
};

export default Notify;
