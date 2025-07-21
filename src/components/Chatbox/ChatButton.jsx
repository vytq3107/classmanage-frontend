'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import UserBox from './UserBox'

export default function ChatButton({ role }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(prev => !prev)}
        className="w-16 h-16 rounded-full bg-primary text-white shadow-xl hover:scale-105 transition-all"
      >
        <MessageCircle size={36} />
      </Button>

      {open && (
        <div className="absolute bottom-20 right-0 z-50 w-[33vw] max-w-sm">
          <UserBox role={role} onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
