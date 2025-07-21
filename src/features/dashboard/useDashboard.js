import { useEffect, useRef, useState } from 'react'
import { db } from '@/lib/firebase'
import { ref, onValue, off } from 'firebase/database'
import {
  addStudent,
  editStudent,
  deleteStudent,
} from '@/services/user'

export function useDashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)
  const ignoreNextAlertRef = useRef(false) 

  useEffect(() => {
    const studentsRef = ref(db, 'user')
    const unsubscribe = onValue(
      studentsRef,
      (snapshot) => {
        const data = snapshot.val()

        const studentList = Object.entries(data)
          .filter(([id, user]) => user.role === 'stu')
          .map(([id, user]) => ({ id, ...user }))

        setStudents(studentList)

        if (!ignoreNextAlertRef.current) {
          if (studentList.length > 0) {
            setAlert({
              type: 'success',
              title: 'Student list loaded',
              description: `${studentList.length} students loaded successfully.`,
            })
          } else {
            setAlert({
              type: 'error',
              title: 'No students found',
              description: 'There are currently no students in the system.',
            })
          }
          setTimeout(() => setAlert(null), 4000)
        }

        ignoreNextAlertRef.current = false

        setLoading(false)
      },
      (err) => {
        console.error('Firebase error:', err)
        setError('Failed to load students')
        setAlert({
          type: 'error',
          title: 'Error load data',
          description: 'cannot connect firebase',
        })
        setLoading(false)
        setTimeout(() => setAlert(null), 4000)
      }
    )

    return () => off(studentsRef)
  }, [])


  const handleAddStudent = async (data) => {
    try {
      const res = await addStudent(data)
      if (res.success) {
        ignoreNextAlertRef.current = true
        setAlert({
          type: 'success',
          title: 'Add new student successfully! ',
          description: `${data.name} added`,
        })
      } else {
        setAlert({
          type: 'error',
          title: 'Error when add',
          description: 'Cannot add student.',
        })
      }
    } catch (err) {
      console.error(err)
      setAlert({
        type: 'error',
        title: 'Server error',
        description: 'Error',
      })
    } finally {
      setTimeout(() => setAlert(null), 4000)
    }
  }

  const handleEditStudent = async (phone, data) => {
    try {
      const res = await editStudent(phone, data)
      if (res.success) {
        ignoreNextAlertRef.current = true
        setAlert({
          type: 'success',
          title: 'Update sucessfully',
          description: `Student ${data.name} is updated.`,
        })
      } else {
        setAlert({
          type: 'error',
          title: 'Update error',
          description: 'Cannot update',
        })
      }
    } catch (err) {
      console.error(err)
      setAlert({
        type: 'error',
        title: 'Server Error',
        description: 'Error',
      })
    } finally {
      setTimeout(() => setAlert(null), 4000)
    }
  }

  const handleDeleteStudent = async (phone) => {
    try {
      const res = await deleteStudent(phone)
      if (res.success) {
        ignoreNextAlertRef.current = true
        setAlert({
          type: 'success',
          title: 'Delete successfully!',
          description: 'Student is deleted!',
        })
      } else {
        setAlert({
          type: 'error',
          title: 'Delete fail',
          description: 'Cannot delete this student.',
        })
      }
    } catch (err) {
      console.error(err)
      setAlert({
        type: 'error',
        title: 'Server error',
        description: 'Error.',
      })
    } finally {
      setTimeout(() => setAlert(null), 4000)
    }
  }

  return {
    students,
    loading,
    error,
    alert,
    addStudent: handleAddStudent,
    deleteStudent: handleDeleteStudent,
    editStudent: handleEditStudent,
  }
}
