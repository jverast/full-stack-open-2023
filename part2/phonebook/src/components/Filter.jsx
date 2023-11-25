import Persons from "./Persons"
import Field from "./Field"
import PropTypes from "prop-types"

const Filter = ({ persons, searchTerm, handleFilterChange }) => {
  const filtered = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Field
        handleChange={({ target }) => handleFilterChange(target.value)}
        value={searchTerm}
        tag="filter shown with"
      />
      {searchTerm && (
        <>
          <br />
          <Persons persons={filtered} onlyRead={true} />
        </>
      )}
    </>
  )
}

export default Filter

Filter.propTypes = {
  persons: PropTypes.array,
  searchTerm: PropTypes.string,
  handleFilterChange: PropTypes.func
}
