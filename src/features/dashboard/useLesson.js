// features/dashboard/useLesson.js
'use client'

import { useEffect, useState, useCallback } from 'react'
import { db } from '@/lib/firebase'
import { ref, onValue, off, get  } from 'firebase/database'
import { assignLesson } from '@/services/lesson'
import { getMyLessons } from '@/services/lesson'

export function useLessonData() {
  const [students, setStudents] = useState([])
  const [lessonsMap, setLessonsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const studentRef = ref(db, 'user')
    const lessonRef = ref(db, 'lesson')

    const unsubscribeStudent = onValue(
      studentRef,
      (snapshot) => {
        const data = snapshot.val() || {}
        const studentList = Object.entries(data)
          .filter(([_, user]) => user.role === 'stu')
          .map(([id, user]) => ({ studentId: id, ...user }))
        setStudents(studentList)
        setLoading(false)
      },
      (err) => {
        console.error('Error loading students:', err)
        setError(err)
        setLoading(false)
      }
    )

    const unsubscribeLesson = onValue(
      lessonRef,
      (snapshot) => {
        const data = snapshot.val() || {}
        setLessonsMap(data)
      },
      (err) => {
        console.error('Error loading lessons:', err)
        setError(err)
      }
    )

    return () => {
      off(studentRef)
      off(lessonRef)
    }
  }, [])

  return { students, lessonsMap, loading, error }
}

export function useLessonManage() {
  const [draggingLessonId, setDraggingLessonId] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeStudentId, setActiveStudentId] = useState(null)
  const [dismissedLessonIds, setDismissedLessonIds] = useState([])
    const [alert, setAlert] = useState(null)

const showAlert = useCallback((type, title, description) => {
  setAlert({ type, title, description })
  setTimeout(() => {
    setAlert(null)
  }, 3000)
}, [])


  const handleAssignLesson = useCallback(async (studentPhone, lessonId) => {
  try {
    const res = await assignLesson({ studentPhone, lessonId })
    if (res.success) {
      showAlert('success', 'Assign successfully', 'Lesson is assigned')
    } else {
      setAlert({
        type: 'error',
        title: 'Fail',
        description: 'Cannot assign, please try again',
      })
          setTimeout(() => {
      setAlert(null)
    }, 3000)
    }
  } catch (err) {
    console.error(err)
    setAlert({
      type: 'error',
      title: 'Error',
      description: 'Error',
    })
    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }
}, [])


  const onDragStart = useCallback((event) => {
    setDraggingLessonId(event.active.id)
    setActiveLesson(event.active.data.current)
  }, [])

  const onDragEnd = useCallback(async (event) => {
    const { over, active } = event

    if (over && over.id.startsWith('drop-')) {
      const studentPhone = over.data.current.studentPhone
      const lessonId = active.id

      setDraggingLessonId(null)
      setActiveLesson(null)

      await handleAssignLesson(studentPhone, lessonId)
      return
    }

    setDraggingLessonId(null)
    setActiveLesson(null)
  }, [handleAssignLesson])

  return {
    draggingLessonId,
    activeLesson,
    activeStudentId,
    setActiveStudentId,
    dismissedLessonIds,
    setDismissedLessonIds,
    onDragStart,
    onDragEnd,
    alert
  }
}

export function useStudentLessonData(userId) {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const studentRef = ref(db, `user/${userId}/lessons`)

    const unsubscribe = onValue(
      studentRef,
      async (snapshot) => {
        const data = snapshot.val() || {}

        if (Object.keys(data).length === 0) {
          setLessons([])
          setLoading(false)
          return
        }

        const lessonPromises = Object.entries(data).map(async ([lessonId, progressData]) => {
          const lessonSnap = await get(ref(db, `lesson/${lessonId}`))
          const lessonDetail = lessonSnap.val()

          if (!lessonDetail) return null

          return {
            id: lessonId,
            ...lessonDetail,
            ...progressData,
          }
        })

        const resolvedLessons = await Promise.all(lessonPromises)
        const filtered = resolvedLessons.filter(Boolean) 
        setLessons(filtered)
        setLoading(false)
      },
      (err) => {
        console.error('Error when fetch data:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => {
    }
  }, [userId])

  return { lessons, loading, error }
}
