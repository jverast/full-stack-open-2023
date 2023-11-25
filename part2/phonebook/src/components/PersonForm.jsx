import Field from "./Field"
import Button from "./Button"
import PropTypes from "prop-types"

const PersonForm = ({
  addPerson,
  handleNameChange,
  handleNumberChange,
  newName,
  newNumber
}) => {
  return (
    <form onSubmit={addPerson}>
      <Field
        handleChange={({ target }) => handleNameChange(target.value)}
        value={newName}
        tag="name"
      />
      <Field
        handleChange={({ target }) => handleNumberChange(target.value)}
        value={newNumber}
        tag="number"
      />
      <div>
        <Button type="submit" text="add" />
      </div>
    </form>
  )
}

export default PersonForm

PersonForm.propTypes = {
  addPerson: PropTypes.func,
  handleNameChange: PropTypes.func,
  handleNumberChange: PropTypes.func,
  newName: PropTypes.string,
  newNumber: PropTypes.string
}
