'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export default function AddStudentForm({
  addStudent,
  deleteStudent,
  editStudent,
  mode = 'add',
  initialData = { name: '', email: '', phone: '' },
  onClose,
}) {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      return alert('Please fill all of informations')
    }

    const { name, email, phone } = formData

    if (mode === 'edit') {
      const isPhoneChanged = phone !== initialData.phone

      if (isPhoneChanged) {
        //
        await deleteStudent(initialData.phone)
        await addStudent({ name, email, phone })
      } else {
        await editStudent(initialData.phone, { name, email, phone })
      }

      onClose?.()
    } else {
      await addStudent({ name, email, phone })
      onClose?.()
      setFormData({ name: '', email: '', phone: '' })
    }
  }


  const renderForm = () => (
    <Card className="h-full flex flex-col justify-between">
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {mode === 'add' || (mode === 'edit' && !initialData?.setupCompleted) ? (
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              disabled
            />
            <p className="text-sm text-muted-foreground italic">
              You cannot edit phone number after account setup.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          onClick={handleSubmit}
        >
          {mode === 'edit' ? 'Update' : 'Submit'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="w-full max-w-md">
      {mode === 'add' ? (
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="w-full flex justify-between">
            <TabsTrigger value="add">Add Student</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>

          <div className="min-h-[350px]">
            <TabsContent value="add" className="h-full">
              {renderForm()}
            </TabsContent>

            <TabsContent value="guide" className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                  <CardDescription>
                    Fill in the student's information completely to add them to the system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2 flex-1">
                  <p>• Full name must not be empty.</p>
                  <p>• Email must be valid and not duplicated with another student.</p>
                  <p>• Phone number must follow the international format (Ex:+849xxxxxxxx, Ex:+1xxxxxxxx, ... ).</p>
                  <p>• After being added, the system will send an email for the student to set up their account.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        renderForm()
      )}
    </div>
  )
}
