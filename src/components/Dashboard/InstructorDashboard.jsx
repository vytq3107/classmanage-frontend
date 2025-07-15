'use client'

import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import DashboardMenu from './DashboardMenu'
import StudentFormDialog from './StudentFormDialog'
import StudentTable from './StudentTable'
import { LessonTable } from '../LessonTable/LessonTable'
import ChatIcon from '../Chatbox/ChatIcon'
import { useChat } from '@/features/chat/useChat'
import { useDashboardMenu } from '@/features/dashboard/useDashboardMenu'
import { useStudentTable } from '@/features/student/useStudentTable'
import { useStudentFormDialog } from '@/features/student/useStudentFormDialog'

export default function InstructorDashboard() {
  const { activeTab, handleTabChange } = useDashboardMenu()
  const {
    messages,
    selectedUser,
    handleUserClick,
    toggleMessageTab,
    isMessageOpen,
    setMessage,
    handleSendMessage,
  } = useChat()
  const { students, refreshStudents } = useStudentTable()
  const { editData, handleEdit, handleSave, handleCancel } = useStudentFormDialog()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b-2 pb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold">Instructor Dashboard</h1>
          <DashboardMenu onTabChange={handleTabChange} />
        </div>
        <div className="relative">
          <Avatar onClick={() => {}}>
            <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="Instructor Avatar" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className={`flex-1 ${isMessageOpen ? 'mr-0' : 'mr-1/3'}`}>
          {activeTab === 'student' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Students</h2>
                <StudentFormDialog editData={editData} onSave={handleSave} onCancel={handleCancel} />
              </div>
              <StudentTable students={students} onEdit={handleEdit} />
            </>
          )}

          {activeTab === 'lesson' && (
            <div>
              <h2 className="text-xl font-semibold">Manage Lessons</h2>
              <LessonTable studentId="stu1752216376002" />
            </div>
          )}
        </div>

        <div
          className={`flex-none ${isMessageOpen ? 'block' : 'hidden'} w-1/3 bg-gray-100 p-4 rounded-md border shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <Button onClick={toggleMessageTab} variant="outline" className="mb-4 w-full">
            {isMessageOpen ? 'Hide Messages' : 'Show Messages'}
          </Button>

          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => handleUserClick(student.name)}
                className="p-2 bg-gray-200 rounded-md cursor-pointer"
              >
                {student.name}
              </div>
            ))}
          </div>

          {selectedUser && (
            <div className="mt-4">
              <h3>Chat with {selectedUser}</h3>
              <div className="space-y-2">
                {messages
                  .filter((msg) => msg.user === selectedUser)
                  .map((msg, index) => (
                    <div key={index} className="text-sm bg-gray-200 p-2 rounded-lg">
                      <strong>{msg.user}:</strong> {msg.message}
                    </div>
                  ))}
              </div>
              <div className="mt-4">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full"
                />
                <Button onClick={handleSendMessage} className="mt-2 w-full">
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatIcon students={students} />
    </div>
  )
}
