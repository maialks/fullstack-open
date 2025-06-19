import "./index.css"
import {useState, useEffect} from "react"
import phonebookService from './services/phonebook'
import Search from "./components/Search"
import Person from "./components/Person"
import Form from "./components/Form"


const Notification = ({message}) => {
  if (!message) return null
  return <p style={{maxWidth: 250}}>{message}</p>
}

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    phonebookService
    .getAll()
    .then(res => setPersons(res))
  }, [])
  const [newNumber, setNewNumber] = useState("")
  const [message, setMessage] = useState("")
  const [newName, setNewName] = useState("")
  const [search, setSearch] = useState("")
  
  const searchResults = persons.filter(person => 
    person.name.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
  )


  const checkDuplicate = newPerson => 
    persons.find(person => person.name.toLocaleLowerCase() == newPerson.toLocaleLowerCase())

  const clearUI = (delay = 3000) => {
    setTimeout(()=> setMessage(""), delay)
    setNewNumber("")
    setNewName("")
  }

  const addNew = (ev) => {
    ev.preventDefault()
    const isDuplicate = checkDuplicate(newName)
    if (isDuplicate) return handleDuplicate(isDuplicate)
      phonebookService
      .create({name: newName, number: newNumber})
      .then(res => {
        setPersons(persons.concat(res))
        setMessage(`${res.name} added successfully ✅`)
      })
      .catch(err => setMessage(`❌ ${err.response.data}`))
      .finally(clearUI())
  }

  const handleNameChange = (ev) => {
    ev.preventDefault()
    setNewName(ev.target.value)
  }

  const handleNumChange = (ev) => {
    ev.preventDefault()
    setNewNumber(ev.target.value)
  }

  const handleDuplicate = (person) => {
    if (person.number == newNumber) {
      setMessage(`${person.name} is already in book`)
      clearUI()
      return
    }
    if (!(confirm(`${person.name} is already registered, do you want to update number?`))) {
      setMessage(`Contact update canceled by user`)
      clearUI()
      return
    }
      phonebookService
        .update(person.id, {...person, number:newNumber})
        .then(updated => {
          setPersons(
          persons.map(person => person.id === updated.id ? updated : person))
          setMessage(`${updated.name}' contact update successfully ✅`)
        })
        .catch(err=> setMessage(`❌ ${err.response.data}`))
        .finally(clearUI())
      
    
  }

  const handleDelBtn = (delPerson) => {
    return function () {
      phonebookService
      .del(delPerson.id)
      .then(res => {
        setPersons(persons.filter(person => person.id !== res.id))
        setMessage(`${delPerson.name} deleted successfully ✅`)
      })
      .catch(setMessage(`Error deleting ${delPerson.name}`))
      .finally(clearUI())
    }
  }

  return (
    <div style={{paddingLeft: "15%", width: "90%"}}>
      <h1>the <br/> phonebook.</h1>
      <Notification message={message}/>
      <Form newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumChange={handleNumChange} addNew={addNew}/>
      <Search setSearch={setSearch}/>
      <ul style={{width: "100%", display:"flex", flexDirection: "column"}}>
        {searchResults.map(person => 
        <Person name={person.name} number={person.number} key={person.id} onClick={handleDelBtn(person)}/>)}
      </ul>
    </div>
  )
}

export default App