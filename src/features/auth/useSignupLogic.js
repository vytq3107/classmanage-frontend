import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useSignupLogic() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    const phoneParam = urlParams.get('phone')

    if (emailParam) {
      setEmail(emailParam)
    }

    if (phoneParam) {
      setPhone(phoneParam)
    }

    if (!emailParam && !phoneParam) {
      router.push('/auth/login')
    }
  }, [router])

  return { email, phone }
}
