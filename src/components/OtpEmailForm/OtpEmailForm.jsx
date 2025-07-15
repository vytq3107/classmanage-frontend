'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast, ToastContainer } from 'react-toastify'
import { OtpVerifyForm } from '../OtpVerifyForm/OtpVerifyForm'
import { useAuthFlow } from '@/features/auth/useAuthFlow'

export function LoginFormEmail({ setMode }) {
  const { identifier, step, handleSendOtp, reset } = useAuthFlow()
  const [email, setEmail] = useState('')

  if (step === 'verify') {
    return <OtpVerifyForm identifier={identifier} onBack={reset} />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleSendOtp(email, 'email')
      toast.success('OTP has been sent to your email')
    } catch (err) {
      toast.error('Failed to send OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login with Email</CardTitle>
          <CardDescription>We will send OTP to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Send OTP
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode('username')}
            className="w-full"
          >
            ← Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
