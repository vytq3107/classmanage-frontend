'use client'

import { useSignupLogic } from '@/features/auth/useSignupLogic'
import { SignupContent } from '@/components/Signup/SignupContent'

export default function SignupPage() {
  const { email, phone, isRedirecting } = useSignupLogic()

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <SignupContent email={email} phone={phone} />
      </div>
    </div>
  )
}
