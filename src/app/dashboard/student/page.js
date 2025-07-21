'use client'

import StudentDashboard from '@/components/Dashboard/Student'
import { useAuthFlow } from '@/features/auth/useAuthFlow'

export default function StudentPage() {
  const { user } = useAuthFlow()

  if (!user) return <div className="p-4 text-gray-500">⏳ Authenticating</div>
  if (user.role !== 'stu') return <div className="p-4 text-red-500">🚫 No permission</div>
console.log("user:", user)

  return <StudentDashboard studentId={user.userId} />

}
