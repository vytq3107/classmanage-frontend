'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SendHorizontal, ArrowLeft, X } from 'lucide-react'
import { db } from '@/lib/firebase'
import { useAuthFlow } from '@/features/auth/useAuthFlow'
import { ref, push, onValue, off, serverTimestamp } from 'firebase/database'
import { format, isToday, isYesterday } from 'date-fns'
import vi from 'date-fns/locale/vi'
import { connectSocket, getSocket } from '@/lib/socket'
import axios from 'axios'
import useSocketChat from '@/features/chat/useSocketChat'

function formatDateGroup(timestamp) {
  const date = new Date(timestamp)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'dd/MM/yyyy')
}

function formatTime(timestamp) {
  return format(new Date(timestamp), 'HH:mm')
}

function formatTimestampSmart(timestamp) {
  const now = new Date()
  const msgDate = new Date(timestamp)

  const diffInMs = now - msgDate
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    // cùng ngày
    return 'Today ' + format(msgDate, 'HH:mm', { locale: vi })
  } else if (diffInDays === 1) {
    return 'Yesterday ' + format(msgDate, 'HH:mm', { locale: vi })
  } else {
    return format(msgDate, 'dd/MM/yyyy HH:mm', { locale: vi })
  }
}

export default function ChatBox({ user, onBack, onClose, role = 'ins', currentUserId, selectedUser}) {
  const { user: currentUser } = useAuthFlow()
  const [messages, setMessages] = useState([])
const { messages: socketMessages, sendMessage } = useSocketChat(
  currentUser?.userId,
  user?.userId
)

  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const getChatId = () => {
    const ids = [currentUser.userId, user.userId]
    return ids.sort().join('_') // format id_id
  }

  useEffect(() => {
  const fetchChatHistory = async () => {
    if (!currentUser || !currentUser.userId || !user || !user.userId) {
      console.warn('Waiting for user info...')
      return
    }

    try {
      const res = await axios.get('http://localhost:5003/chat/history', {
        params: {
          senderId: currentUser.userId,
          receiverId: user.userId,
        },
      })

      if (res.data?.success && res.data.data.length > 0) {
        const chatData = res.data.data[0].messages || []
        setMessages(chatData)
      } else {
        setMessages([])
      }
    } catch (err) {
      console.error('Error fetch history:', err)
    }
  }

  fetchChatHistory()
}, [currentUser?.userId, user?.userId])


  const handleSend = async () => {
  if (!input.trim()) return

  const msg = {
    senderId: currentUser.userId,
    receiverId: user.userId,
    message: input.trim()
  }

  const socket = getSocket()
  if (socket && socket.connected) {
    socket.emit('sendMessage', msg)
  } else {
    try {
      await fetch('http://localhost:5003/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
      })
    } catch (err) {
      console.error('Send message error:', err)
    }
  }
const message = {
    sender: currentUser.userId,
    receiver: user.userId,
    content: input.trim(),
    timestamp: Date.now(),
  }

  socket.emit('send_message', message)
  setMessages((prev) => [...prev, message])

  setInput('')
}


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  useEffect(() => {
  if (socketMessages.length > 0) {
    setMessages((prev) => {
      const all = [...prev, ...socketMessages]
      const unique = Array.from(new Map(all.map(m => [m.timestamp + m.sender, m])).values())
      return unique.sort((a, b) => a.timestamp - b.timestamp)
    })
  }
}, [socketMessages])
if (!currentUser?.userId || !user?.userId) return null
  let lastDate = ''

  return (
  <Card className="h-[70vh] w-full rounded-2xl shadow-xl p-4 flex flex-col bg-white relative">
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h3 className="text-base font-semibold">{user.name}</h3>
      </div>
      <Button size="icon" variant="ghost" onClick={onClose}>
        <X size={20} />
      </Button>
    </div>
    
    {/* Nội dung chat */}
    <div className="flex-1 overflow-y-auto pr-2">
      <div className="flex flex-col gap-3 pb-4">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === currentUser.userId;
          const thisMsgDate = format(new Date(msg.timestamp), 'yyyy-MM-dd');
          const showDateHeader = thisMsgDate !== lastDate;
          if (showDateHeader) lastDate = thisMsgDate;
          
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              {/* Header ngày nếu đổi ngày */}
              {showDateHeader && (
                <div className="text-sm text-muted-foreground my-3 font-semibold">
                  {formatDateGroup(msg.timestamp)}
                </div>
              )}

              <div className={`w-full flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col items-start max-w-[80%]">
                  <div
                    className={`px-4 py-2 rounded-2xl whitespace-pre-wrap break-words ${
                      isMe
                        ? 'bg-blue-500 text-white rounded-br-none self-end'
                        : 'bg-gray-200 text-black rounded-bl-none self-start'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <span
                    className={`text-[10px] mt-1 text-muted-foreground ${
                      isMe ? 'self-end' : 'self-start'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>

    {/* Input */}
    <div className="mt-3 flex items-center gap-2">
      <Input
        placeholder="Type message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend() }
        className="flex-1"
      />
      <Button size="icon" onClick={handleSend}>
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </div>
  </Card>
);

}
