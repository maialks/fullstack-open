import axios from 'axios'
const baseUrl = '/api/blogs'

let token
const setToken = (newToken) => (token = `Bearer ${newToken}`)

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (obj) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.post(baseUrl, obj, config)
  return res.data
}

const update = async (obj) => {
  const res = await axios.put(`${baseUrl}/${obj.id}`, obj)
  return res.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}
export default { getAll, create, setToken, update, remove }
