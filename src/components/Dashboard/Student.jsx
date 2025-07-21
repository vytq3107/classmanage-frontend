'use client'

import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar'
import { UserIcon, NotebookIcon } from 'lucide-react'
import { useState } from 'react'
import MenuStudent from './MenuStudent'
import LessonView from './Table/LessonView'
import Profile from './Profile'
import ChatButton from '@/components/Chatbox/ChatButton'

export default function Student() {
  const [tab, setTab] = useState('lesson')
  const [showProfile, setShowProfile] = useState(false)

  const onTabChange = (tabName) => {
    if (tabName === 'profile') {
      setShowProfile(true)
    } else {
      setTab(tabName)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <MenuStudent onTabChange={onTabChange} />
      {tab === 'lesson' && <LessonView />}
      <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <div className="fixed bottom-5 right-5 z-50">
        <ChatButton role="stu" />
      </div>
    </div>
    
  )
}