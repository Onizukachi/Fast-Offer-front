import axios from 'axios'

export const fetchPositions = async () => {
  const { data } = await axios.get(`http://localhost:3001/api/v1/positions`, {
    params: {}
  })

  return data
}