import axios from 'axios'
import { useState, useEffect } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(({ data }) => {
      setResources(data)
    })
  }, [])

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject)
    console.log(response)
    setResources(resources.concat(response.data))
  }

  const service = {
    create
  }

  return [resources, service]
}
