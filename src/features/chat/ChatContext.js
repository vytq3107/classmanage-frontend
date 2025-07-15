// 'use client'

// import { createContext, useContext, useState, useEffect } from 'react'
// import { io } from 'socket.io-client'

// const socket = io('http://localhost:5003')

// const ChatContext = createContext()

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [message, setMessage] = useState('')
//   const [isChatListOpen, setIsChatListOpen] = useState(false)

//   useEffect(() => {
//     socket.on('receive_message', (newMessage) => {
//       setMessages((prev) => [...prev, newMessage])
//     })

//     return () => {
//       socket.off('receive_message')
//     }
//   }, [])

//   const handleUserClick = (user) => setSelectedUser(user)
//   const handleBackToList = () => setSelectedUser(null)

//   const handleSendMessage = () => {
//     if (message.trim() && selectedUser) {
//       const newMessage = {
//         user: selectedUser,
//         message,
//         timestamp: new Date().toISOString(),
//       }
//       socket.emit('send_message', newMessage)
//       setMessages((prev) => [...prev, newMessage])
//       setMessage('')
//     }
//   }

//   const toggleChatList = () => {
//     setIsChatListOpen(prev => !prev)
//     setSelectedUser(null)
//   }

//   return (
//     <ChatContext.Provider
//       value={{
//         messages,
//         selectedUser,
//         message,
//         isChatListOpen,
//         setMessage,
//         handleUserClick,
//         handleSendMessage,
//         toggleChatList,
//         handleBackToList,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   )
// }

// export const useChat = () => useContext(ChatContext)
