import { useState, useEffect } from "react"
import axios from "axios"
import PropTypes from "prop-types"

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((element) => (
          <li key={element}>{element}</li>
        ))}
      </ul>
      <br />
      <img src={country.flags.png} alt={country.name.common} />
    </div>
  )
}

const Countries = ({ filtered, country, getCountry }) => {
  if (filtered && country) return <Country country={country} />
  return (
    <>
      {filtered &&
        (filtered.length > 10 ? (
          <div>Too many matches, specify another filter</div>
        ) : filtered.length > 1 ? (
          <div>
            {filtered.map((country) => (
              <div key={country}>
                {country}{" "}
                <button onClick={() => getCountry(country)}>show</button>
              </div>
            ))}
          </div>
        ) : (
          <>{country && <Country country={country} />}</>
        ))}
    </>
  )
}

const Input = ({ search, handleSearchChange, text }) => (
  <>
    {text} <input value={search} onChange={handleSearchChange} />
  </>
)

const App = () => {
  const [search, setSearch] = useState("")
  const [countries, setCountries] = useState(null)
  const [filtered, setFiltered] = useState(null)
  const [country, setCountry] = useState(null)

  const handleSearchChange = ({ target }) => {
    setSearch(target.value)
    setFiltered(
      countries.filter((country) =>
        country.toLowerCase().includes(target.value.toLowerCase())
      )
    )
  }

  const getCountry = (country) => {
    const url = `https://studies.cs.helsinki.fi/restcountries/api/name/${country}`
    axios
      .get(url)
      .then((response) => {
        const data = response.data
        setCountry(data)
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    const url = "https://studies.cs.helsinki.fi/restcountries/api/all/"
    axios
      .get(url)
      .then((response) => {
        const data = response.data
        setCountries(data.map((el) => el.name.common))
      })
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    if (!filtered) return
    if (filtered && filtered.length === countries.length) setFiltered(null)
    if (filtered.length === 1) {
      const country = filtered.join()
      getCountry(country)
    } else {
      setCountry(null)
    }
  }, [filtered, countries])

  return (
    <>
      <Input
        search={search}
        handleSearchChange={handleSearchChange}
        text="find countries"
      />
      <Countries
        filtered={filtered}
        country={country}
        getCountry={getCountry}
      />
    </>
  )
}

export default App

// Typechecking

Input.propTypes = {
  search: PropTypes.string,
  handleSearchChange: PropTypes.func,
  text: PropTypes.string
}

Country.propTypes = {
  country: PropTypes.object
}

Countries.propTypes = {
  filtered: PropTypes.array,
  country: PropTypes.object,
  getCountry: PropTypes.func
}
