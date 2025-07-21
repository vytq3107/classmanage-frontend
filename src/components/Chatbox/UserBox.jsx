'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Users, CircleDot } from 'lucide-react'
import ChatBox from './ChatBox'
import { ref, onValue, get, child } from 'firebase/database'
import { db } from '@/lib/firebase'
import { useAuthFlow } from '@/features/auth/useAuthFlow'

function getRandomAvatar(name) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  const bgColors = ['bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-purple-200']
  const color = bgColors[Math.floor(Math.random() * bgColors.length)]

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black ${color}`}
    >
      {initials}
    </div>
  )
}

export default function UserBox({ onClose, role }) {
  const { user: currentUser } = useAuthFlow()
  const [chatUsers, setChatUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (!currentUser?.userId) return

    const chatRef = ref(db, 'chat')

    const unsubscribe = onValue(chatRef, async (snapshot) => {
      const data = snapshot.val()
      if (!data) return

      const currentId = currentUser.userId
      const partnerIds = new Set()

      for (const chatId of Object.keys(data)) {
        if (chatId.includes(currentId)) {
          const [id1, id2] = chatId.split('_')
          const partnerId = id1 === currentId ? id2 : id1
          partnerIds.add(partnerId)
        }
      }

      const usersRef = ref(db, 'user')
      const usersSnap = await get(usersRef)
      const allUsers = usersSnap.val()
      const userList = []

      partnerIds.forEach((id) => {
        const u = allUsers?.[id]
        if (u) {
          userList.push({
            userId: id,
            name: u.name,
            role: u.role,
            phone: u.phone,
          })
        }
      })

      setChatUsers(userList)
    })

    return () => unsubscribe()
  }, [currentUser?.userId])

  return (
    <Card className="h-[70vh] w-full rounded-2xl shadow-xl p-4 relative bg-white">
      {!selectedUser && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Chat Users</h3>
          </div>

          <ScrollArea className="h-[85%] pr-2">
            {chatUsers.map((user) => (
              <Button
                key={user.userId}
                variant="ghost"
                className="w-full justify-start items-center gap-2 rounded-xl py-3"
                onClick={() => setSelectedUser(user)}
              >
                {getRandomAvatar(user.name)}
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{user.name}</div>
                </div>
                <CircleDot className="text-green-500" size={18} />
              </Button>
            ))}
          </ScrollArea>
        </>
      )}

      {selectedUser && (
        <div className="absolute inset-0">
          <ChatBox
            user={selectedUser}
            onBack={() => setSelectedUser(null)}
            onClose={onClose}
            role={role}
          />
        </div>
      )}
    </Card>
  )
}
