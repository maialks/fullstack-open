import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => axios.get(baseUrl).then((res) => res.data);

const create = (newObject) =>
  axios.post(baseUrl, newObject).then((res) => res.data);

const update = (id, newObject) =>
  axios.put(`${baseUrl}/${id}`, newObject).then((res) => res.data);

const del = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((res) => {
    return res.data;
  });

export default { getAll, update, create, del };
