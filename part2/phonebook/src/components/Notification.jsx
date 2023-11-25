import PropTypes from "prop-types"

const Notification = ({ message }) => {
  if (!message) return
  return (
    <>
      {message.variant === "success" ? (
        <div className="message" style={{ color: "green" }}>
          {message.text}
        </div>
      ) : (
        <div className="message" style={{ color: "red" }}>
          {message.text}
        </div>
      )}
    </>
  )
}

export default Notification

Notification.propTypes = {
  message: PropTypes.object
}
