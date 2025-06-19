import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = () => axios.get(baseUrl).then((res) => res.data)

export const create = (anecdote) =>
  axios.post(baseUrl, anecdote).then((res) => res.data)

export const update = (updatedObj) =>
  axios.put(`${baseUrl}/${updatedObj.id}`, updatedObj).then((res) => res.data)
