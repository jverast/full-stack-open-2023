import { Alert } from 'react-bootstrap'

const Notification = ({ info }) => {
  if (!info) {
    return
  }

  return (
    <Alert
      className="info"
      style={{ width: '100%' }}
      variant={info.type === 'error' ? 'danger' : 'success'}
    >
      {info.message}
    </Alert>
  )
}

export default Notification
