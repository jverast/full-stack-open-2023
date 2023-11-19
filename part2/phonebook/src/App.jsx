import { useState } from "react"
import PropTypes from "prop-types"

const Heading = ({ title }) => <h2>{title}</h2>

const Form = ({ handleSubmit, handleChange, newName }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person }) => {
  return <div>{person.name}</div>
}

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }])
  const [newName, setNewName] = useState("")

  const handleChange = ({ target }) => setNewName(target.value)
  const handleSubmit = (event) => {
    event.preventDefault()
    // Prevent addition of empty names
    if (newName) {
      setPersons([...persons, { name: newName }])
      setNewName("")
    }
  }

  return (
    <div>
      <Heading title="Phonebook" />
      <Form
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        newName={newName}
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

Form.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  newName: PropTypes.string
}

Person.propTypes = {
  person: PropTypes.object
}
