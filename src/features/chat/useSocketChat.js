import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_SERVER_URL = 'http://localhost:5003'

export default function useSocketChat(currentUserId, targetUserId) {
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null)

  const getChatId = (a, b) => [a, b].sort().join('_')

  useEffect(() => {
    if (!currentUserId || !targetUserId) {
      console.error('Invalid user IDs: currentUserId or targetUserId is missing');
      return;
    }

    //  socket
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'], 
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      socket.emit('register', currentUserId)
    })

    // recieve mes from server
    socket.on('receiveMessage', (msg) => {
      const isRelated =
        (msg.sender === currentUserId && msg.receiver === targetUserId) ||
        (msg.sender === targetUserId && msg.receiver === currentUserId)

      if (isRelated) {
        setMessages((prev) => {
          // sort message by time
          const updatedMessages = [...prev, msg]
          updatedMessages.sort((a, b) => a.timestamp - b.timestamp)
          return updatedMessages
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    })

    return () => {
      socket.disconnect()
    }
  }, [currentUserId, targetUserId])

  const sendMessage = (content) => {
    if (!socketRef.current || !content.trim()) return

    socketRef.current.emit('sendMessage', {
      senderId: currentUserId,
      receiverId: targetUserId,
      message: content
    })
  }

  return {
    messages,
    sendMessage
  }
}
