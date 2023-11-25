import Button from "./Button"
import PropTypes from "prop-types"

const Person = ({ person, onlyRead, deletePerson }) => {
  return (
    <>
      {onlyRead ? (
        <div>
          {person.name} {person.number}
        </div>
      ) : (
        <div>
          {person.name} {person.number}{" "}
          <Button type="button" text="delete" deletePerson={deletePerson} />
        </div>
      )}
    </>
  )
}

export default Person

Person.propTypes = {
  person: PropTypes.object,
  onlyRead: PropTypes.bool,
  deletePerson: PropTypes.func
}
