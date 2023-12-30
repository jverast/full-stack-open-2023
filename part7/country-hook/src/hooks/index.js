import axios from 'axios'
import { useEffect, useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name) {
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(({ data }) => {
          const countries = data.map(({ name }) => name.common.toLowerCase())
          const isCountry = countries.includes(name.toLowerCase())

          if (!isCountry) {
            return setCountry({ data: null, found: false })
          }

          axios
            .get(
              `https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`
            )
            .then(({ data }) => {
              setCountry({ data, found: true })
            })
        })
    }
  }, [name])

  return country
}
