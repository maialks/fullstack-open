import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (obj, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const res = await axios.post(baseUrl, obj, config)
  return res.data
}

const update = async (obj) => {
  const res = await axios.put(`${baseUrl}/${obj.id}`, obj)
  return res.data
}

const remove = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}
export default { getAll, create, update, remove }
