import axios from 'axios'

const API_BASE = 'http://localhost:5000/auth'

export const sendOtp = async ({ identifier, type }) => {
  const res = await axios.post(`${API_BASE}/loginOtp`, { identifier, type })
  return res.data
}

export const verifyOtp = async ({ identifier, accessCode }) => {
  const res = await axios.post(`${API_BASE}/verifyLoginOtp`, { identifier, accessCode })
  return res.data
}

export const loginWithUsername = async ({ username, password }) => {
  const res = await axios.post(`${API_BASE}/login`, { username, password })
  return res.data
}

export const sendSignupOtp = async ({ identifier, type }) => {
  const res = await axios.post(`${API_BASE}/createAccessCode`, { identifier, type })
  return res.data
}

export const setCredentials = async ({ identifier, username, password }) => {
  const res = await axios.post(`${API_BASE}/setCredentials`, { identifier, username, password })
  return res.data
}
