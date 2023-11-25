import PropTypes from "prop-types"

const Heading = ({ title, isSubtitle = false }) => {
  return !isSubtitle ? <h2>{title}</h2> : <h3>{title}</h3>
}

export default Heading

Heading.propTypes = {
  title: PropTypes.string,
  isSubtitle: PropTypes.bool
}
