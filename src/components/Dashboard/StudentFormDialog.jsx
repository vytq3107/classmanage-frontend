'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { addStudent, editStudent } from '@/services/user'

export default function StudentFormDialog({ editData, refresh }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  useEffect(() => {
    if (editData) {
      setForm(editData)
      setOpen(true)
    }
  }, [editData])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      if (editData) {
        await editStudent(form.phone, {
          name: form.name,
          email: form.email,
        })
        toast.success('Student updated')
      } else {
        await addStudent(form)
        toast.success('Student added')
      }

      refresh()
      setOpen(false)
      setForm({ name: '', phone: '', email: '' })
    } catch (err) {
      toast.error('Failed to save student')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!editData && (
        <DialogTrigger asChild>
          <Button>Add Student</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Student' : 'New Student'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {!editData && (
            <Input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>
            {editData ? 'Update' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
