'use client'

import { useState } from 'react'
import MenuBar from './MenuBar'
import StudentInfo from './Table/StudentInfo'
import Lesson from './Table/LessonManage'
import { useDashboard } from '@/features/dashboard/useDashboard'
import Profile from './Profile'
import ChatButton from '@/components/Chatbox/ChatButton'

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('student')
  const dashboard = useDashboard()
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <div className="p-4 space-y-4">
      <MenuBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProfile={() => setProfileOpen(true)}
      />
      <div>
        {activeTab === 'student' && (
          <StudentInfo
            students={dashboard.students}
            loading={dashboard.loading}
            error={dashboard.error}
            deleteStudent={dashboard.deleteStudent}
            addStudent={dashboard.addStudent}
            editStudent={dashboard.editStudent}
            alert={dashboard.alert} 
          />
        )}
        {activeTab === 'lesson' && <Lesson />}
        <Profile open={profileOpen} onOpenChange={setProfileOpen} />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ChatButton role="instructor" />
      </div>
    </div>
  )
}
