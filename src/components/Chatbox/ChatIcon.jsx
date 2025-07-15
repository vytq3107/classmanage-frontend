'use client'

import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import ChatList from './ChatList'
import ChatBox from './ChatBox'
import { useChat } from '@/features/chat/useChat'

export default function ChatIcon({ students }) {
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const  { senderId } = useChat()
  console.log("senderId", senderId);
  
  const toggleChat = () => {
    setIsChatVisible((prev) => !prev)
  }

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <button
        onClick={toggleChat}
        className="p-3 bg-blue-500 text-white rounded-full shadow-lg"
      >
        <MessageCircle size={24} />
      </button>

      {isChatVisible && (
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-lg shadow-lg">
          {selectedUser ? (
            <ChatBox selectedUser={selectedUser} setSelectedUser={setSelectedUser} senderId={senderId} />
          ) : (
            <ChatList students={students} setSelectedUser={setSelectedUser} />
          )}
        </div>
      )}
    </div>
  )
}
