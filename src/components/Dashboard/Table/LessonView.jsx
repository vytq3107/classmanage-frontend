'use client'

import * as React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { CheckCircle, Clock } from 'lucide-react'
import { useStudentLessonData } from '@/features/dashboard/useLesson'
import { useAuthFlow } from '@/features/auth/useAuthFlow' 
import { markLessonDone } from '@/services/lesson'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LessonView() {
  const { user } = useAuthFlow() //user.phone
  const { lessons, loading, error } = useStudentLessonData(user?.userId)

  const [selectedLessonId, setSelectedLessonId] = React.useState(null)

  React.useEffect(() => {
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id) // lessonid
    }
  }, [lessons, selectedLessonId])

  const selectedLesson = lessons.find(
  (l) => `lesson-${l.id}` === selectedLessonId
)


  if (loading) return <div className="p-6 text-gray-500">Loading data....</div>
  if (error) return <div className="p-6 text-red-500">Error when loading data</div>
  if (lessons.length === 0) return <div className="p-6 text-gray-500">No lessons have been assigned yet.</div>

  return (
    <div className="flex h-screen">
      <div className="w-1/3 flex flex-col overflow-y-auto border-r p-6 bg-white">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Lesson list</h2>
  <Accordion
  type="single"
  collapsible
  value={selectedLessonId}
  onValueChange={(id) => {
    setSelectedLessonId((prev) => (prev === id ? null : id))
  }}
  className="space-y-2"
>
  {lessons.map((lesson) => {
    const id = `lesson-${lesson.id}`

    return (
      <AccordionItem key={id} value={id}>
        <AccordionTrigger className="flex items-center justify-between text-sm text-left">
          <div className="flex items-center gap-2">
            {lesson.done ? (
              <CheckCircle className="text-green-600 w-4 h-4" />
            ) : (
              <Clock className="text-yellow-500 w-4 h-4 animate-pulse" />
            )}
            <span>{lesson.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-gray-600">
          {lesson.description}
        </AccordionContent>
      </AccordionItem>
    )
  })}
</Accordion>

</div>


      {/*Right colum */}
      <div className="w-2/3 h-full p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Lesson Video</h2>
        {selectedLesson ? (
  <>
    <iframe
      src={selectedLesson.embedUrl}
      title={selectedLesson.title}
      allowFullScreen
      className="w-full h-[75%] rounded-md border"
    />
    {!selectedLesson.done && (
      <Button
        className="mt-4"
        onClick={async () => {
          try {
            await markLessonDone({
              phone: user.phone,
              lessonId: selectedLesson.id,
            })
            toast.success('Done lesson!')
            
          } catch (err) {
            console.error(err)
            toast.error('Error')
          }
        }}
      >
        Make as done
      </Button>
    )}
  </>
) : (
  <div className="text-gray-500">No lesson selected</div>
)}

      </div>
    </div>
  )
}
