'use client'

import * as React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock , BookOpen } from 'lucide-react'
import { useLessonData, useLessonManage } from '@/features/dashboard/useLesson'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import DashboardAlert from '../Notification/DashboardAlert'

function DraggableLessonItem({ lessonId, lesson }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lessonId,
    data: lesson
  })

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0 : 1,
    cursor: 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border rounded-md p-2 bg-blue-50 hover:bg-blue-100 transition text-sm flex items-center gap-2"
    >
      <BookOpen className="text-blue-600 w-4 h-4" />
      <span>{lesson.title}</span>
    </div>
  )
}

function DropZone({ student, draggingLessonId }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${student.phone}`,
    data: { studentPhone: student.phone }
  })

  const [flash, setFlash] = React.useState(false)

  const lessons = Object.entries(student.lessons || {}).map(([id, data]) => ({
    id,
    ...data
  }))

  const canDrop = draggingLessonId && !lessons.some((l) => l.id === draggingLessonId)

  React.useEffect(() => {
    if (isOver && canDrop) {
      setFlash(true)
      const timeout = setTimeout(() => setFlash(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [isOver])

  if (!canDrop) return null

  return (
    <div
      ref={setNodeRef}
      className={`mt-4 border-2 border-dashed rounded-md p-4 text-center text-sm font-medium transition-all duration-300
        ${flash ? 'bg-green-100 border-green-500 text-green-700 font-semibold scale-[1.02]' :
        isOver ? 'bg-blue-100 border-blue-600 text-blue-500' :
          'border-blue-400 text-blue-500'
        }`}
    >
      Drop lesson in here
    </div>
  )
}



export default function LessonManage() {
  const { students, lessonsMap, loading, error } = useLessonData()
  const {
    draggingLessonId,
    activeLesson,
    activeStudentId,
    setActiveStudentId,
    dismissedLessonIds,
    setDismissedLessonIds,
    onDragStart,
    onDragEnd
  } = useLessonManage()

  if (loading) return <div className="p-4 text-gray-600">⏳ Loading data...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>
  
  return (
    
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="w-full flex space-x-4">
        {alert && <DashboardAlert alert={alert} />}
        {/* Left Column */}
        <div className="w-1/2 border rounded-md p-4 space-y-4 bg-white">
          <div className="grid grid-cols-[2fr_1fr] gap-4 font-semibold text-sm text-gray-600">
            <div>Student</div>
            <div>Compelete percent</div>
          </div>

          {students.map((student) => {
            const lessonsObj = student.lessons || {}
            const lessons = Object.entries(lessonsObj).map(([id, data]) => ({
              id,
              ...data,
              ...lessonsMap[id] // addtitle, des, video
            }))

            const total = lessons.length
            const completed = lessons.filter((l) => l.done).length
            const progressValue = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <Accordion
                key={student.studentId}
                type="single"
                collapsible
                value={activeStudentId}
                onValueChange={(value) => setActiveStudentId(value)}
                className="border-b pb-2"
              >
                <AccordionItem value={student.studentId}>
                  <div className="grid grid-cols-[2fr_1fr] items-center gap-4">
                    <AccordionTrigger className="text-left text-base font-medium">
                      {student.name}
                    </AccordionTrigger>
                    <Progress value={progressValue} className="w-full" />
                  </div>

                  <AccordionContent>
                    <Accordion type="multiple" className="ml-2">
                      {lessons.map((lesson) => (
                        <AccordionItem key={lesson.id} value={lesson.id}>
                          <AccordionTrigger className="text-sm flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              {lesson.done ? (
  <CheckCircle className="text-green-600 w-4 h-4" />
) : (
  <Clock className="text-yellow-500 w-4 h-4 animate-pulse" />
)}
                              <span>{lesson.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex gap-4 mt-2">
                              <div className="border rounded p-1 bg-gray-50">
                                <iframe
                                  src={lesson.embedUrl}
                                  title={lesson.title}
                                  allowFullScreen
                                  className="w-[300px] h-[170px] rounded-md"
                                />
                              </div>
                              <div className="text-sm text-gray-700">
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p>{lesson.description}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {draggingLessonId &&
                      student.studentId === activeStudentId &&
                      !lessons.some((l) => l.id === draggingLessonId) && (
                        <DropZone student={student} draggingLessonId={draggingLessonId} />
                      )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          })}
        </div>

        {/* middle colum */}
        <div className="w-1/2 border rounded-md p-4 bg-white overflow-auto max-h-[600px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">All of Lessons</h3>

          <Accordion type="multiple" className="space-y-2">
            {Object.entries(lessonsMap).map(([lessonId, lesson]) => {
              if (dismissedLessonIds.includes(lessonId)) return null

              return (
                <AccordionItem key={lessonId} value={lessonId}>
                  <AccordionTrigger className="text-sm flex items-center justify-between text-left w-full">
                    <DraggableLessonItem lessonId={lessonId} lesson={lesson} />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-4 mt-2">
                      <div className="border rounded p-1 bg-gray-50">
                        <iframe
                          src={lesson.embedUrl}
                          title={lesson.title}
                          allowFullScreen
                          className="w-[300px] h-[170px] rounded-md"
                        />
                      </div>
                      <div className="text-sm text-gray-700">
                        <h4 className="font-semibold mb-2">Key content</h4>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                          {Array.isArray(lesson.description) ? (
                            lesson.description.map((item, index) => <li key={index}>{item}</li>)
                          ) : (
                            <li>{lesson.description}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>

      <DragOverlay>
        {activeLesson && (
          <div
            className="border rounded-md p-2 bg-blue-50 text-sm flex items-center gap-2 shadow-lg"
            style={{
              zIndex: 50,
              pointerEvents: 'none',
              position: 'fixed',
              top: 0,
              left: 0,
            }}
          >
            <BookOpen className="text-blue-600 w-4 h-4" />
            <span>{activeLesson.title}</span>
          </div>
        )}
      </DragOverlay>
      

    </DndContext>
    
  )
}
