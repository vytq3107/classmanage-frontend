'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2 } from 'lucide-react'
import { getStudents, deleteStudent } from '@/services/user'
import { toast } from 'react-toastify'

export default function StudentTable({ onEdit }) {
  const [students, setStudents] = useState([])

  const fetchData = async () => {
    try {
      const res = await getStudents()
      setStudents(res.students || [])
    } catch (error) {
      toast.error('Failed to load students')
    }
  }

  const handleDelete = async (phone) => {
    try {
      await deleteStudent(phone)
      toast.success('Student deleted')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete student')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="overflow-x-auto border rounded-xl mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(s)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(s.phone)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
