'use client'

import { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast, ToastContainer } from 'react-toastify'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthFlow } from '@/features/auth/useAuthFlow'
import { OtpVerifyForm } from '../OtpVerifyForm/OtpVerifyForm'

export function LoginFormPhone({ setMode }) {
  const { identifier, step, handleSendOtp, reset } = useAuthFlow()
  const [phone, setPhone] = useState('')

  if (step === 'verify') {
    return <OtpVerifyForm identifier={identifier} onBack={reset} />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleSendOtp(`+${phone}`, 'phone')
      toast.success('OTP has been sent via SMS')
    } catch (err) {
      toast.error('Failed to send OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login with Phone Number</CardTitle>
          <CardDescription>We will send OTP to your phone via SMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <PhoneInput
              country="vn"
              value={phone}
              onChange={setPhone}
              inputClass="!w-full"
              inputStyle={{ width: '100%' }}
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
