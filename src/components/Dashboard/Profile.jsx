'use client'

import { useState, useEffect  } from 'react'
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
import { Dialog, DialogContent, DialogTrigger, DialogTitle  } from '@/components/ui/dialog'
import { useAuthFlow } from '@/features/auth/useAuthFlow'
import { editStudent } from '@/services/user'


export default function Profile({ isOpen, onClose }) {
  const [open, setOpen] = useState(isOpen || false)
  const { user } = useAuthFlow()

  const [formData, setFormData] = useState({
  name: user?.name || '',
  email: user?.email || '',
})

useEffect(() => {
  if (user) {
    setFormData({ name: user.name, phone: user.phone })
  }
}, [user])

  const handleSave = async () => {
  try {
    const res = await editStudent(user.phone, formData)
    if (res.success) {
      alert('Update failed!')
      setOpen(false)
      onClose?.()
    } else {
      alert('Update failed!')
    }
  } catch (err) {
    console.error('Update failed:', err)
    alert('Server error')
  }
}
useEffect(() => {
  setOpen(isOpen)
}, [isOpen])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogTitle>Profile</DialogTitle>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Edit User Account</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change Password</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
