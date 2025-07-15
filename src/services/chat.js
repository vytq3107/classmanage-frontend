import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'http://localhost:5003/chat'

export const getUserIdFromToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      return decoded.userId
    }
  }
  return null
}

export const getStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5001/user/students') // Replace with the correct API endpoint
    return response.data
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error
  }
}

export const getChatHistory = async (senderId, receiverId) => {
  try {
    const response = await axios.get(`${API_URL}/history`, {
      params: { senderId, receiverId },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching chat history:', error)
    throw error
  }
}

export const sendMessage = async (receiverId, message) => {
  try {
    const senderId = getUserIdFromToken()
    if (!senderId) {
      window.location.href = '/auth/login'
      return
    }

    const response = await axios.post(`${API_URL}/send`, {
      senderId,
      receiverId,
      message,
    })

    return response.data
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}
