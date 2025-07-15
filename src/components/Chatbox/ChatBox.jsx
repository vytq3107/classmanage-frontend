'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatFeed, Message } from 'react-chat-ui'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChat } from '@/features/chat/useChat'
import { getChatHistory } from '@/services/chat'
import { io } from 'socket.io-client'

export default function ChatBox({ selectedUser, setSelectedUser }) {
  const {
    senderId,
    messages,
    setMessages,
    message,
    setMessage,
  } = useChat()

  const socketRef = useRef(null)

  useEffect(() => {
    if (!senderId) return

    socketRef.current = io('http://localhost:5003')

    socketRef.current.on('receiveMessage', (newMessage) => {
      const currentSenderId = senderId

      setMessages((prevMessages) => [
        ...prevMessages,
        new Message({
          id: newMessage.sender === currentSenderId ? 0 : 1,
          message: newMessage.content,
        }),
      ])
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [senderId])

  useEffect(() => {
    if (selectedUser && senderId) {
      const fetchHistory = async () => {
        try {
          const response = await getChatHistory(senderId, selectedUser.id)
          if (response.success) {
            const history = response.data.map((msg) =>
              new Message({
                id: msg.sender === senderId ? 0 : 1,
                message: msg.content,
              })
            )
            setMessages(history)
          }
        } catch (err) {
          console.error('Failed to fetch chat history:', err)
        }
      }

      fetchHistory()
    }
  }, [selectedUser, senderId])

  const handleSendMessage = () => {
    if (!message.trim()) return

    socketRef.current.emit('sendMessage', {
      senderId,
      receiverId: selectedUser.id,
      message,
    })

    setMessages([
      ...messages,
      new Message({ id: 0, message }),
    ])
    setMessage('')
  }

  const handleBackToUserList = () => {
    setSelectedUser(null)
  }

  const isReady = senderId && selectedUser

  return (
    <div className="flex-1 p-4 bg-white rounded-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Chat with {selectedUser?.name}
      </h2>

      <Button onClick={handleBackToUserList} variant="outline" className="mb-4">
        Back to User List
      </Button>

      <div className="space-y-2">
        {isReady ? (
          <ChatFeed messages={messages} showSenderName={false} />
        ) : (
          <div className="text-gray-500">Loading chat...</div>
        )}
      </div>

      <div className="mt-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full"
        />
        <Button onClick={handleSendMessage} className="mt-2 w-full" disabled={!isReady}>
          Send
        </Button>
      </div>
    </div>
  )
}
