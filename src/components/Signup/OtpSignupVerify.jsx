'use client'

import { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { toast, ToastContainer } from 'react-toastify'
import { verifyOtp } from '@/services/auth'

export function OtpSignupVerify({ phone, setStep }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    try {
      setLoading(true)
      await verifyOtp({ identifier: `+${phone}`, accessCode: otp })
      toast.success('OTP verified successfully')
      setStep('form')
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed')
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
          <p className="text-sm text-muted-foreground">Sent to: {phone}</p>
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
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </div>
      </div>
    </div>
  )
}
