import axios from 'axios'

export const getLessonsForStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5002/lesson/students/with-lessons')

    if (response.data.success) {
      return response.data.students
    }

    throw new Error('Failed to fetch students with lessons')
  } catch (error) {
    console.error('Error fetching lessons for students:', error)
    throw error
  }
}
