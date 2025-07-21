import axios from 'axios'

const getToken = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split('; ')
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='))
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }
  }
  return null
}

const API_URL = 'http://localhost:5001/user'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getStudents = async () => {
  const res = await axiosInstance.get('/students')
  return res.data
}

export const addStudent = async (data) => {
  const res = await axiosInstance.post('/addStudent', data)
  return res.data
}

export const editStudent = async (phone, data) => {
  const res = await axiosInstance.put(`/editStudent/${phone}`, data)
  return res.data
}

export const deleteStudent = async (phone) => {
  const res = await axiosInstance.delete(`/student/${phone}`)
  return res.data
}

export const getStudentByPhone = async (phone) => {
  const res = await axiosInstance.get(`/student/${phone}`)
  return res.data
}
