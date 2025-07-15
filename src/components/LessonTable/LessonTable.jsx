'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  TableCaption,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { getLessonsForStudents } from '@/services/lesson'

export function LessonTable() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const studentsData = await getLessonsForStudents()
        setStudents(studentsData)
      } catch (error) {
        toast.error('Failed to load lessons.')
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  const handleMarkAsDone = async (studentId, lessonId) => {
    try {
      // Call API to mark lesson as done
      toast.success('Marked as completed.')
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                lessons: student.lessons.map((lesson) =>
                  lesson.id === lessonId
                    ? { ...lesson, done: true, completedAt: Date.now() }
                    : lesson
                ),
              }
            : student
        )
      )
    } catch (error) {
      toast.error('Failed to update lesson status.')
    }
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableCaption>Student lesson list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No students or lessons found.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  {student.lessons.map((lesson) => (
                    <div key={lesson.id}>
                      <p>{lesson.title}</p>
                      <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">
                        Video
                      </a>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {student.lessons.map((lesson) => (
                    <div key={lesson.id}>
                      {lesson.done ? 'Completed' : 'Incomplete'}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {student.lessons.map((lesson) =>
                    !lesson.done ? (
                      <Button
                        key={lesson.id}
                        onClick={() => handleMarkAsDone(student.studentId, lesson.id)}
                        variant="outline"
                      >
                        Mark as Completed
                      </Button>
                    ) : null
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
