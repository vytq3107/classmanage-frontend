'use client'

import { useState, useEffect } from 'react'
import { sendOtp, verifyOtp } from '@/services/auth'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

export function useAuthFlow() {
  const [identifier, setIdentifier] = useState('')
  const [step, setStep] = useState('input') // 'input' | 'verify'

  useEffect(() => {
    const saved = localStorage.getItem('otpIdentifier')
    if (saved) {
      setIdentifier(saved)
      setStep('verify')
    }
  }, [])

  const handleSendOtp = async (value, type) => {
    try {
      const data = await sendOtp({ identifier: value, type })
      toast.success(data.message)
      setIdentifier(value)
      localStorage.setItem('otpIdentifier', value)
      setStep('verify')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    }
  }

  const handleVerifyOtp = async (otp) => {
    try {
      const data = await verifyOtp({ identifier, accessCode: otp })
      toast.success(data.message)
      Cookies.set('token', data.token, { expires: 7 })
      localStorage.removeItem('otpIdentifier')
      window.location.href = '/'
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed')
    }
  }

  const reset = () => {
    setIdentifier('')
    setStep('input')
    localStorage.removeItem('otpIdentifier')
  }

  return {
    identifier,
    step,
    handleSendOtp,
    handleVerifyOtp,
    reset,
  }
}
