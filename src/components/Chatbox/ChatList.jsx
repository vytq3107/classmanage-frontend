'use client'

import React from 'react'

export default function ChatList({ students, setSelectedUser }) {
  return (
    <div className="w-full p-4 bg-gray-100 rounded-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="space-y-4">
        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => setSelectedUser(student)}  // Lấy toàn bộ thông tin người dùng
            className="p-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
          >
            {student.name}
          </div>
        ))}
      </div>
    </div>
  )
}
