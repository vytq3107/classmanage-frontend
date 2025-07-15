'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { verifyOtp } from '@/services/auth'

export function OtpVerifyForm({ identifier, onBack }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    try {
      setLoading(true)
      const data = await verifyOtp({ identifier, accessCode: otp })

      toast.success('Login successful')
      Cookies.set('token', data.token, { expires: 7 })
      localStorage.removeItem('otpIdentifier')

      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Verification failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold">Enter OTP</h2>
          <p className="text-sm text-muted-foreground">Sent to: {identifier}</p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="space-x-2"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="border-blue-600 focus-visible:ring-blue-600 text-blue-600 text-xl w-12 h-12"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleVerify}
            disabled={otp.length < 6 || loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? 'Verifying...' : 'Login'}
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  )
}
