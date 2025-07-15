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
import { sendOtp } from '@/services/auth'

export function OtpSignup({ setStep, setPhone }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (otpSent) {
      toast.info('OTP has already been sent.')
      return
    }

    try {
      await sendOtp({ identifier: `+${phoneNumber}`, type: 'phone' })
      toast.success('OTP has been sent via SMS')

      setOtpSent(true)
      setPhone(phoneNumber)
      setStep('verify')
    } catch (err) {
      toast.error('Failed to send OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up with Phone Number</CardTitle>
          <CardDescription>We will send an OTP via SMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <PhoneInput
              country="vn"
              value={phoneNumber}
              onChange={setPhoneNumber}
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
        </CardFooter>
      </Card>
    </div>
  )
}
