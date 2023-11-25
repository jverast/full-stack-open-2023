import Person from "./Person"
import PropTypes from "prop-types"

const Persons = ({ persons, onlyRead = false, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          onlyRead={onlyRead}
          deletePerson={() => deletePerson(person.id)}
        />
      ))}
    </div>
  )
}

export default Persons

Persons.propTypes = {
  persons: PropTypes.array,
  onlyRead: PropTypes.bool,
  deletePerson: PropTypes.func
}
