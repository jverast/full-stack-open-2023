import PropTypes from "prop-types"

const Button = ({ type, text, deletePerson = null }) => (
  <button type={type} onClick={deletePerson}>
    {text}
  </button>
)

export default Button

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  deletePerson: PropTypes.func
}
