import { useEffect, useState } from "react"
import personService from "./services/persons"
import Heading from "./components/Heading"
import Notification from "./components/Notification"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

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
