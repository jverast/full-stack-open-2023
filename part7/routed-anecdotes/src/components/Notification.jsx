const Notification = ({ notification }) => {
  return (
    <>{notification && <div>a new anecdote {notification} created!</div>}</>
  )
}

export default Notification
