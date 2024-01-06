const Notify = ({ message }) => {
  if (!message) {
    return null
  }
  return <p style={{ padding: 5, border: 'thin solid' }}>{message}</p>
}

export default Notify
