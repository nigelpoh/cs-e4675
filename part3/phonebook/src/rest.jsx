import axios from 'axios'
const baseUrl = '/api/persons'

const get = () => {
  return axios.get(baseUrl)
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson)
}

const deleteObj = id => {
  return axios.delete(baseUrl + "/" + id)
}

const update = (updatedPerson) => {
  return axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson)
}

export default { 
  get: get, 
  create: create,
  deleteObj: deleteObj,
  update: update
}
