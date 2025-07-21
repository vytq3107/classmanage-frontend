import axios from 'axios'

const API_BASE = 'http://localhost:5000/auth'

export const loginWithUsername = async ({ username, password }) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { username, password })

    return res.data
  } catch (err) {
    console.error('Login error:', err)

    const status = err?.response?.status

    if (status === 401 || status === 404) {
      return {
        success: false,
        message: 'Wrong username or password'
      }
    }

    if (status === 500) {
      return {
        success: false,
        message: 'Server error'
      }
    }
    return {
      success: false,
      message: err?.response?.data?.message || 'Undefined error'
    }
    
  }
}

export const sendOtp = async ({ identifier, type }) => {
  const res = await axios.post(`${API_BASE}/loginOtp`, { identifier, type })
  return res.data
}

export const verifyOtp = async ({ identifier, accessCode }) => {
  const res = await axios.post(`${API_BASE}/verifyLoginOtp`, { identifier, accessCode })
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

export const verifySignupOtp = async ({ identifier, accessCode }) => {
  const res = await axios.post('http://localhost:5000/auth/validateAccessCode', { identifier, accessCode })
  return res.data
}
