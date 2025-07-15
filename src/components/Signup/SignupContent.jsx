'use client'

import { useState } from 'react'
import { SignupForm } from './SignupForm'
import { OtpSignup } from './OtpSignup'
import { OtpSignupVerify } from './OtpSignupVerify'

export function SignupContent() {
  const [step, setStep] = useState('phone') // 'phone', 'verify', 'form'
  const [phone, setPhone] = useState('')

  const handleBack = () => {
    if (step === 'form') {
      setStep('verify')
    } else if (step === 'verify') {
      setStep('phone')
    }
  }

  return (
    <div>
      {step === 'phone' && (
        <OtpSignup setStep={setStep} setPhone={setPhone} />
      )}
      {step === 'verify' && (
        <OtpSignupVerify phone={phone} setStep={setStep} />
      )}
      {step === 'form' && (
        <SignupForm phone={phone} setStep={setStep} />
      )}
    </div>
  )
}
