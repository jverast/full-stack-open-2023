import { useState } from "react"
import PropTypes from "prop-types"

const Heading = ({ title }) => <h2>{title}</h2>

const Field = ({ handleChange, value }) => (
  <input onChange={handleChange} value={value} />
)

const Form = ({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  newName,
  newNumber
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{" "}
        <Field
          handleChange={({ target }) => handleNameChange(target.value)}
          value={newName}
        />
      </div>
      <div>
        number:{" "}
        <Field
          handleChange={({ target }) => handleNumberChange(target.value)}
          value={newNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" }
  ])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")

  const handleNameChange = (value) => setNewName(value)
  const handleNumberChange = (value) => setNewNumber(value)

  const handleSubmit = (event) => {
    event.preventDefault()

    const namesToArray = persons.reduce(
      (arr, person) => arr.concat(person.name),
      []
    )

    // Prevent addition of empty fields
    if (!newName || !newNumber) return

    // Avoid duplicate name fields
    if (!namesToArray.includes(newName)) {
      setPersons([...persons, { name: newName, number: newNumber }])
      setNewName("")
      setNewNumber("")
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <Heading title="Phonebook" />
      <Form
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <Heading title="Numbers" />
      {persons.map((person) => (
        <Person key={person.name} person={person} />
      ))}
    </div>
  )
}

export default App

// Typechecking with PropTypes

Heading.propTypes = {
  title: PropTypes.string
}

Field.propTypes = {
  handleChange: PropTypes.func,
  value: PropTypes.string
}

Form.propTypes = {
  handleSubmit: PropTypes.func,
  handleNameChange: PropTypes.func,
  handleNumberChange: PropTypes.func,
  newName: PropTypes.string,
  newNumber: PropTypes.string
}

Person.propTypes = {
  person: PropTypes.object
}
