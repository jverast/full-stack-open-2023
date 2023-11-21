import { useState, useEffect } from "react"
import axios from "axios"
import PropTypes from "prop-types"

const List = ({ collection, isItemized = true }) => {
  return (
    <>
      {isItemized ? (
        <ul>
          {collection.map((element) => (
            <li key={element}>{element}</li>
          ))}
        </ul>
      ) : (
        <div>
          {collection.map((element) => (
            <div key={element}>{element}</div>
          ))}
        </div>
      )}
    </>
  )
}

const CountryFilteredInner = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <List collection={Object.values(country.languages)} />
      <br />
      <img src={country.flags.png} alt={country.name.common} />
    </div>
  )
}

const CountriesFiltered = ({ filtered, country }) => {
  return (
    <>
      {filtered &&
        (filtered.length > 10 ? (
          <div>Too many matches, specify another filter</div>
        ) : filtered.length > 1 ? (
          <List collection={filtered} isItemized={false} />
        ) : (
          <>{country && <CountryFilteredInner country={country} />}</>
        ))}
    </>
  )
}

const App = () => {
  const [search, setSearch] = useState("")
  const [countries, setCountries] = useState(null)
  const [filtered, setFiltered] = useState(null)
  const [country, setCountry] = useState(null)

  const handleChange = ({ target }) => {
    setSearch(target.value)
    setFiltered(
      countries.filter((country) =>
        country.toLowerCase().includes(target.value.toLowerCase())
      )
    )
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
      const url = `https://studies.cs.helsinki.fi/restcountries/api/name/${country}`
      axios
        .get(url)
        .then((response) => {
          const data = response.data
          setCountry(data)
        })
        .catch((error) => console.log(error))
    } else {
      setCountry(null)
    }
  }, [filtered, countries])

  return (
    <>
      find countries <input value={search} onChange={handleChange} />
      <CountriesFiltered filtered={filtered} country={country} />
    </>
  )
}

export default App

// Typechecking

CountryFilteredInner.propTypes = {
  country: PropTypes.object
}

CountriesFiltered.propTypes = {
  filtered: PropTypes.array,
  country: PropTypes.object
}

List.propTypes = {
  collection: PropTypes.array,
  isItemized: PropTypes.bool
}
