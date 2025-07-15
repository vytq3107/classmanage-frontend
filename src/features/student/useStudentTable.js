'use client'

import { useState, useEffect } from 'react'
import { getStudents } from '@/services/user'

export function useStudentTable() {
  const [students, setStudents] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents()
        console.log('Student API response:', response)

        if (response?.success && Array.isArray(response.students)) {
          setStudents(response.students)
        } else {
          console.error('No student data found in the response')
        }
      } catch (error) {
        console.error('Failed to fetch students:', error)
      }
    }

    fetchStudents()
  }, [refreshFlag])

  const refreshStudents = () => {
    setRefreshFlag((prev) => !prev)
  }

  return {
    students,
    refreshStudents,
  }
}
