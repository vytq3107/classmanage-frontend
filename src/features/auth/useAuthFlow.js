'use client'

import { useEffect, useState } from 'react'
import { sendOtp, verifyOtp, loginWithUsername } from '@/services/auth'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { connectSocket } from '@/lib/socket'


export function useAuthFlow() {
  const [view, setView] = useState('default')
  const [otpType, setOtpType] = useState(null)
  const [identifier, setIdentifier] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  const [alert, setAlert] = useState(null)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)

        connectSocket(decoded.userId)
      } catch (error) {
        console.error('Invalid token', error)
        Cookies.remove('token')
      }
    }
  }, [])

  const loginWithUsernamePassword = async ({ username, password }) => {
    setLoading(true)
    try {
      const res = await loginWithUsername({ username, password })
      if (res?.success && res.token) {
        Cookies.set('token', res.token, {

          expires: 7,
          secure: true,
          sameSite: 'Strict',
        })

        const decoded = jwtDecode(res.token)
        setUser(decoded)
        connectSocket(decoded.userId)

        showAlert('success', 'Login Successful', 'Welcome back!')
        const role = decoded.role
        if (role === 'ins') window.location.href = '/dashboard/instructor'
        else if (role === 'stu') window.location.href = '/dashboard/student'
        else window.location.href = '/'
      } else {
        showAlert('error', 'Login Failed', res?.message || 'Wrong credentials')
      }
    } catch (err) {
      showAlert('error', 'Login Failed', 'Server error')
    } finally {
      setLoading(false)
    }
  }


  const showAlert = (type, title, description) => {
    setAlert({ type, title, description })
    setTimeout(() => setAlert(null), 5000)
  }

  const goToView = (v) => setView(v)

  const requestOtp = async ({ type, id }) => {
    setLoading(true)
    try {
      const res = await sendOtp({ type, identifier: id })
      if (res?.success) {
        setOtpType(type)
        setIdentifier(id)
        setView('otp')
        showAlert('success', 'OTP Sent', `OTP code has been sent to your ${type}`)
      } else {
        showAlert('error', 'Send OTP Failed', res?.message || 'Could not send OTP')
      }
    } catch (err) {
      console.error('Send OTP error:', err)
      showAlert('error', 'Request Failed', 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpCode = async () => {
    if (!identifier || !accessCode) {
      showAlert('error', 'Missing Input', 'Please enter OTP code.')
      return
    }

    setLoading(true)
    try {
      const res = await verifyOtp({ identifier, accessCode })

      if (res?.success && res.token) {
        Cookies.set('token', res.token, {
          expires: 7,
          secure: true,
          sameSite: 'Strict',
        })

        const decoded = jwtDecode(res.token)
        setUser(decoded)
        connectSocket(decoded.userId)

        const role = decoded?.role

        showAlert('success', 'Login Successful', 'Welcome back!')

        if (role === 'ins') {
          window.location.href = '/dashboard/instructor'
        } else if (role === 'stu') {
          window.location.href = '/dashboard/student'
        } else {
          window.location.href = '/'
        }
      } else {
        showAlert('error', 'Invalid OTP', res?.message || 'OTP verification failed')
      }
    } catch (err) {
      console.error('Verify OTP error:', err)
      showAlert('error', 'Verify Failed', 'Wrong OTP. Please try again')
    } finally {
      setLoading(false)
    }
  }

  return {
    view,
    goToView,
    requestOtp,
    verifyOtpCode,
    setAccessCode,
    accessCode,
    otpType,
    identifier,
    loading,
    alert,
    user,
    loginWithUsernamePassword
  }
}
