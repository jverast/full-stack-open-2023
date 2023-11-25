import PropTypes from "prop-types"

const Field = ({ handleChange, value, tag }) => (
  <div>
    {tag}: <input onChange={handleChange} value={value} name={tag} />
  </div>
)

export default Field

Field.propTypes = {
  handleChange: PropTypes.func,
  value: PropTypes.string,
  tag: PropTypes.string
}
