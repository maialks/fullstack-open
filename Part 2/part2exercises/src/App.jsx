import "./index.css"
import {useState, useEffect} from "react"
import countriesServices from './services/countries'
import Search from "./components/Search"
import Countries from "./components/Countries"
import useDebounce from "./hooks/useDebounce"


const Notification = ({message}) => {
  if (!message) return null
  return <p>{message}</p>
}

const App = () => {

  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 120)

  useEffect(() => {
    countriesServices
      .getAll()
      .then(res=> setAllCountries(res));
  }, [])

  const filteredCountries = allCountries.filter((country) =>
    country.name.common.toLowerCase().startsWith(debouncedSearch.toLowerCase())
  );

  const message = 
  debouncedSearch === "" 
    ? "" 
    : filteredCountries.length >= 10 
    ? "Too many matches..." 
    : "";


  return (
    <div style={{paddingLeft: "15%", width: "90%"}}>
      <h1>the <br/> countriesbook.</h1>
      <Notification message={message}/>
      <Search setSearch={setSearch}/>
      <Countries countriesArr={filteredCountries.length >= 10 ? [] : filteredCountries} setSearch={setSearch}/>
    </div>
  )
}

export default App