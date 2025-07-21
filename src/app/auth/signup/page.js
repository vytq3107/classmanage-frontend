'use client'

import { useState } from 'react'
import { sendSignupOtp, verifySignupOtp, setCredentials } from '@/services/auth'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { LoginAlert } from '@/components/LoginForm/LoginAlert'
import OtpForm from '@/components/LoginForm/OtpForm'
import SignupForm from '@/components/LoginForm/SignupForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [step, setStep] = useState('phone') // phone - otp -signup
  const [phone, setPhone] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
    const router = useRouter()

  const handlePhoneChange = (value) => {
    const fullNumber = '+' + value.replace(/[^0-9]/g, '')
    setPhone(fullNumber)
  }

  const handleSendOtp = async () => {
    if (!phone) return setAlert({ type: 'error', title: 'Missing phone', description: 'Please enter your phone number' })

    try {
      setLoading(true)
      await sendSignupOtp({ identifier: phone, type: 'phone' })
      setStep('otp')
      setAlert({ type: 'success', title: 'OTP sent', description: `Code sent to ${phone}` })
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to send OTP', description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      setLoading(true)
      const res = await verifySignupOtp({ identifier: phone, accessCode })
      if (res.success) {
        setStep('signup')
        setAlert({ type: 'success', title: 'OTP Verified', description: 'Please set your account credentials' })
      } else {
        throw new Error('Invalid OTP')
      }
    } catch (error) {
      setAlert({ type: 'error', title: 'OTP Verification Failed', description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async ({ username, password }) => {
    try {
      setLoading(true)
      await setCredentials({ identifier: phone, username, password })
      setAlert({
  type: 'success',
  title: 'Signup successful',
  description: 'Redirecting to login...',
})
setTimeout(() => router.push('/auth/login'), 2000)
    } catch (error) {
      setAlert({ type: 'error', title: 'Signup failed', description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginAlert alert={alert} />

      {step === 'phone' && (
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
            <CardDescription>Enter your phone to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                country={'vn'}
                value={phone}
                onChange={handlePhoneChange}
                enableSearch={true}
                inputProps={{ name: 'phone', required: true, autoFocus: true }}
                inputClass="!w-full !h-10 !text-sm"
                containerClass="!w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-2">
            <Button onClick={handleSendOtp} disabled={loading} className="w-full bg-blue-700 text-white hover:bg-blue-800">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'otp' && (
        <OtpForm
          otpType="phone"
          identifier={phone}
          accessCode={accessCode}
          setAccessCode={setAccessCode}
          onVerify={handleVerifyOtp}
          onBack={() => setStep('phone')}
          loading={loading}
        />
      )}

      {step === 'signup' && (
        <SignupForm
          phoneNumber={phone}
          onSignup={handleSignup}
          onBack={() => setStep('phone')}
          loading={loading}
        />
      )}
    </div>
  )
}
