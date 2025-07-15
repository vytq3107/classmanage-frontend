'use client'

import { useState } from 'react'

export function useStudentFormDialog() {
  const [editData, setEditData] = useState(null)

  const handleEdit = (student) => {
    setEditData(student)
  }

  const handleSave = (studentData) => {
    console.log('Saving student data', studentData)
    setEditData(null)
  }

  const handleCancel = () => {
    setEditData(null)
  }

  return {
    editData,
    handleEdit,
    handleSave,
    handleCancel,
  }
}
