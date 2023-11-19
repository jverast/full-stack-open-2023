import { useState } from "react"
import PropTypes from "prop-types"

const Field = ({ handleChange, value, tag }) => (
  <div>
    {tag}: <input onChange={handleChange} value={value} />
  </div>
)

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
)

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </div>
  )
}

const Filter = ({ persons, filter, handleFilterChange }) => {
  const filtered = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <>
      <Field
        handleChange={({ target }) => handleFilterChange(target.value)}
        value={filter}
        tag="filter shown with"
      />
      {filter && (
        <>
          <br />
          <Persons persons={filtered} />
        </>
      )}
    </>
  )
}

const Button = ({ type, text }) => <button type={type}>{text}</button>

const PersonForm = ({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  newName,
  newNumber
}) => {
  return (
    <form onSubmit={handleSubmit}>
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

const Heading = ({ title, isSubtitle = false }) => {
  if (!isSubtitle) {
    return <h2>{title}</h2>
  }
  return <h3>{title}</h3>
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 }
  ])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")

  const handleNameChange = (value) => setNewName(value)
  const handleNumberChange = (value) => setNewNumber(value)
  const handleFilterChange = (value) => setFilter(value)

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
      setPersons([
        ...persons,
        { name: newName, number: newNumber, id: persons.length + 1 }
      ])
      setNewName("")
      setNewNumber("")
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <Heading title="Phonebook" />
      <Filter
        handleFilterChange={handleFilterChange}
        filter={filter}
        persons={persons}
      />
      <Heading title="Add a new" isSubtitle />
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <Heading title="Numbers" isSubtitle />
      <Persons persons={persons} />
    </div>
  )
}

export default App

// Typechecking with PropTypes

Heading.propTypes = {
  title: PropTypes.string,
  isSubtitle: PropTypes.bool
}

Field.propTypes = {
  handleChange: PropTypes.func,
  value: PropTypes.string,
  tag: PropTypes.string
}

Persons.propTypes = {
  persons: PropTypes.array
}

Filter.propTypes = {
  persons: PropTypes.array,
  filter: PropTypes.string,
  handleFilterChange: PropTypes.func
}

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string
}

PersonForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleNameChange: PropTypes.func,
  handleNumberChange: PropTypes.func,
  newName: PropTypes.string,
  newNumber: PropTypes.string
}

Person.propTypes = {
  person: PropTypes.object
}
