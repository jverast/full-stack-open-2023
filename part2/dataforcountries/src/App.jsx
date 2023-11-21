import { useState, useEffect } from "react"
import axios from "axios"
import PropTypes from "prop-types"

const Country = ({ country, weather }) => {
  return (
    <>
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
        <img
          src={country.flags.png}
          alt={country.name.common}
          style={{ width: 200 }}
        />
      </div>
      <div>
        {weather && (
          <>
            <h2>Weather in {weather.name}</h2>
            <div>
              temperature {eval(weather.main.temp - 272.15).toFixed(2)} Celcius
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather-icon"
            />
            <div>wind {weather.wind.speed} m/s</div>
          </>
        )}
      </div>
    </>
  )
}

const Countries = ({ filtered, country, weather, getCountry }) => {
  if (filtered && country)
    return <Country country={country} weather={weather} />
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
          <>{country && <Country country={country} weather={weather} />}</>
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
  const [weather, setWeather] = useState(null)

  const handleSearchChange = ({ target }) => {
    setSearch(target.value)
    setFiltered(
      countries.filter((country) =>
        country.toLowerCase().includes(target.value.toLowerCase())
      )
    )
  }

  const getCountry = (country) => {
    let countryUrl = `https://studies.cs.helsinki.fi/restcountries/api/name/${country}`
    // country API request
    axios
      .get(countryUrl)
      .then((response) => {
        setCountry(response.data)
        // weather API request
        const city = response.data.capital[0],
          token = import.meta.env.VITE_SOME_KEY

        const proxyUrl = "https://corsproxy.io/?",
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}`

        axios
          .get(proxyUrl + weatherUrl, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => setWeather(response.data))
          .catch((error) => console.log(error))
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
    if (filtered && filtered.length === countries.length) {
      setFiltered(null)
    }
    if (filtered.length === 1) {
      const country = filtered.join()
      getCountry(country)
    } else {
      setCountry(null)
      setWeather(null)
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
        weather={weather}
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
  country: PropTypes.object,
  weather: PropTypes.object
}

Countries.propTypes = {
  filtered: PropTypes.array,
  country: PropTypes.object,
  getCountry: PropTypes.func,
  weather: PropTypes.object
}
