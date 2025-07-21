import axios from 'axios'

const CHAT_API = 'http://localhost:5003/chat'

export async function getChatHistory(senderId, receiverId) {
  try {
    const url = `${CHAT_API}/history?senderId=${senderId}&receiverId=${receiverId}`
    const res = await axios.get(url)
    return res.data
  } catch (err) {
    console.error('Chat history error:', err)
    return { success: false }
  }
}

export async function sendChatMessage({ senderId, receiverId, message }) {
  try {
    const res = await axios.post(`${CHAT_API}/send`, {
      senderId,
      receiverId,
      message,
    })
    return res.data
  } catch (err) {
    console.error('Send message error:', err)
    return { success: false }
  }
}
export async function getOwnChatList(senderId) {
  try {
    const res = await axios.get(`http://localhost:5003/chat/history?senderId=${senderId}`)
    return res.data
  } catch (err) {
    console.error('Error list:', err)
    return { success: false, data: [] }
  }
}
