const BASE_URL = 'http://localhost:5002/lesson'

export async function getAllLessons() {
  const res = await fetch(`${BASE_URL}/all`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch all lessons')
  return res.json()
}

export async function assignLesson({ studentPhone, lessonId }) {
  const res = await fetch(`${BASE_URL}/assignLesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentPhone, lessonId }),
  })
  if (!res.ok) throw new Error('Failed to assign lesson')
  return res.json()
}

export async function markLessonDone({ phone, lessonId }) {
  const res = await fetch(`${BASE_URL}/markLessonDone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, lessonId }),
  })
  if (!res.ok) throw new Error('Failed to mark lesson done')
  return res.json()
}

export async function getStudentLessonStatus(phone) {
  const res = await fetch(`${BASE_URL}/student/${phone}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch student lesson status')
  return res.json()
}

export async function getStudentsWithLessons() {
  const res = await fetch(`${BASE_URL}/students/with-lessons`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch students with lessons')
  return res.json()
}

export async function getMyLessons(phone) {
  const res = await fetch(`${BASE_URL}/myLessons?phone=${phone}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch my lessons')
  return res.json()
}
