import { useState, useEffect } from 'react'
import { getUserIdFromToken } from '@/services/chat'

export function useChat() {
  const [senderId, setSenderId] = useState(null)
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = getUserIdFromToken()
    if (!id) {
      window.location.href = '/auth/login'
      return
    }
    setSenderId(id)
  }, [])

  return {
    senderId,
    messages,
    setMessages,
    selectedUser,
    setSelectedUser,
    message,
    setMessage,
  }
}
