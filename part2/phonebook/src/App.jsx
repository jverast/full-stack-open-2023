import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import personService from "./services/persons"

const Field = ({ handleChange, value, tag }) => (
  <div>
    {tag}: <input onChange={handleChange} value={value} name={tag} />
  </div>
)

const Notification = ({ message }) => {
  if (!message) return
  return (
    <>
      {message.variant === "success" ? (
        <div className="message" style={{ color: "green" }}>
          {message.text}
        </div>
      ) : (
        <div className="message" style={{ color: "red" }}>
          {message.text}
        </div>
      )}
    </>
  )
}

const Button = ({ type, text, deletePerson = null }) => (
  <button type={type} onClick={deletePerson}>
    {text}
  </button>
)

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

const Heading = ({ title, isSubtitle = false }) => {
  if (!isSubtitle) {
    return <h2>{title}</h2>
  }
  return <h3>{title}</h3>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState(null)

  const handleNameChange = (value) => setNewName(value)
  const handleNumberChange = (value) => setNewNumber(value)
  const handleFilterChange = (value) => setSearchTerm(value)

  const addPerson = (event) => {
    event.preventDefault()
    const namesToArray = persons.reduce(
      (arr, person) => arr.concat(person.name),
      []
    )

    // Prevent addition of empty fields
    if (!newName || !newNumber) return

    // Avoid duplicate name fields
    if (!namesToArray.includes(newName)) {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService.create(personObject).then((returnedPerson) => {
        setPersons([...persons, returnedPerson])
        setMessage({
          text: `Added ${returnedPerson.name}`,
          variant: "success"
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })

      setNewName("")
      setNewNumber("")
    } else {
      const confirmAction = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmAction) {
        const id = persons.find(
          (person) => person.name.toLowerCase() === newName.toLowerCase()
        ).id

        const personObject = {
          name: newName,
          number: newNumber
        }

        personService
          .update(id, personObject)
          .then((returnedPerson) =>
            setPersons(
              persons.map((person) =>
                person.id === id ? returnedPerson : person
              )
            )
          )
          .catch(() => {
            setMessage({
              text: `Information of ${newName} has already been removed from server`,
              variant: "error"
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter((person) => person.id !== id))
          })

        setNewName("")
        setNewNumber("")
      } else {
        event.target.number.focus()
        return
      }
    }
    event.target.name.focus()
  }

  const deletePerson = (id) => {
    const confirmAction = confirm(
      `Delete ${persons.find((person) => person.id === id).name} ?`
    )

    if (confirmAction) {
      personService
        .del(id)
        .then(() => console.log(`person was successfully deleted`))

      setPersons(persons.filter((person) => person.id !== id))
    }
  }

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons))
  }, [])

  return (
    <div>
      <Heading title="Phonebook" />
      <Notification message={message} />
      <Filter
        handleFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        persons={persons}
      />
      <Heading title="Add a new" isSubtitle />
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <Heading title="Numbers" isSubtitle />
      <Persons persons={persons} deletePerson={deletePerson} />
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
  persons: PropTypes.array,
  onlyRead: PropTypes.bool,
  deletePerson: PropTypes.func
}

Filter.propTypes = {
  persons: PropTypes.array,
  searchTerm: PropTypes.string,
  handleFilterChange: PropTypes.func
}

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  deletePerson: PropTypes.func
}

PersonForm.propTypes = {
  addPerson: PropTypes.func,
  handleNameChange: PropTypes.func,
  handleNumberChange: PropTypes.func,
  newName: PropTypes.string,
  newNumber: PropTypes.string
}

Person.propTypes = {
  person: PropTypes.object,
  onlyRead: PropTypes.bool,
  deletePerson: PropTypes.func
}

Notification.propTypes = {
  message: PropTypes.object
}
