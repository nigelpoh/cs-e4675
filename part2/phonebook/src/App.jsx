import { useState, useEffect } from 'react'
import rest from './rest'
import "./App.css"

const Filter = ({value, onChange}) => <div>filter shown with <input value={value} onChange={onChange}/></div>

const PersonForm = ({setPersons, persons, setSuccess, setFailure}) => {

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault();
    const personExists = persons.filter(person => person.name == newName)
    if (personExists.length > 0) {
      if(personExists[0].number == newNumber){
        alert(newName + ' is already added to phonebook')
      } else {
        if (window.confirm(newName + "is already added to the phonebook, replace the old number with a new one?")) {
          var updatedPerson = personExists[0]
          updatedPerson.number = newNumber
          rest.update(updatedPerson).then(() => {
            var allPersons = persons
            for (let index = 0; index < allPersons.length; index++) {
              if(allPersons[index].name == newName) {
                allPersons[index].number = newNumber
              }
            } 
            setPersons([...allPersons])
            setSuccess("Updated "+newName)
            setInterval(()=>{
              setSuccess(null)
            }, 2000)
          })
          .catch(() => {
            setFailure("Information of " + newName + " has already been removed from server")
            setInterval(()=>{
              setFailure(null)
            }, 2000)
            setPersons([...persons.filter(p => p.name != newName)])
          })
        }
      }
    } else {
      const newPerson = {name: newName, number: newNumber}
      rest.create(newPerson).then((res) => {
        setPersons([...persons, res.data])
        setSuccess("Added "+newPerson.name)
        setInterval(()=>{
          setSuccess(null)
        }, 2000)
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        <div>name: <input value={newName} onChange={handleNewPerson}/></div>
        <div>number: <input value={newNumber} onChange={handleNewNumber}/></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Persons = ({persons, newSearch, setPersons}) => {
  const deletePerson = (person) => {
    if (window.confirm("Delete " + person.name + "?")) {
      rest.deleteObj(person.id).then(() => {
        const filteredPersons = persons.filter(p => p.id != person.id)
        setPersons(filteredPersons)
      })
    }
  }
  
  const returnedResults = () => {
    const searchResults = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
    return searchResults.map((person) => <div key = {person.id}>{person.name} {person.number}   <button onClick={() => deletePerson(person)}>Delete</button></div>)
  }

  return returnedResults()
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [failureMessage, setFailureMessage] = useState(null)

  useEffect(() => {
    rest.get().then((res) => {
      setPersons(res.data)
    })
  }, [])

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {successMessage} type = {"success"}/>
      <Notification message = {failureMessage} type = {"failure"} />
      <Filter value = {newSearch} onChange = {handleSearch} />
      <h3>Add a new</h3>
      <PersonForm setPersons = {setPersons} persons={persons} setSuccess={setSuccessMessage} setFailure = {setFailureMessage}/>
      <h2>Numbers</h2>
      <Persons persons = {persons} setPersons = {setPersons} newSearch = {newSearch}/>
    </div>
  )
}

export default App