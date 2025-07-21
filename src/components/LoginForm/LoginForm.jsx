'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthFlow } from '@/features/auth/useAuthFlow'
import { LoginAlert } from './LoginAlert'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import OtpForm from './OtpForm'

export function LoginForm() {
  const {
    view,
    goToView,
    requestOtp,
    verifyOtpCode,
    accessCode,
    setAccessCode,
    otpType,
    identifier,
    loading,
    alert,
    loginWithUsernamePassword
  } = useAuthFlow()

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [countryCode, setCountryCode] = useState('vn')
  const handlePhoneChange = (value, data) => {
    const fullNumber = '+' + value.replace(/[^0-9]/g, '')
    setPhone(fullNumber)
  }



  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    console.log('Login form submitted')
    if (!username || !password) {
      showAlert('error', 'Missing fields', 'Please enter both username and password')
      return
    }
    await loginWithUsernamePassword({ username, password })
  }
  const renderDefaultLogin = () => (
    <motion.div key="default" layout {...animationProps}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your Username and Password to access Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <form onSubmit={handleLoginSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-6 bg-blue-700 text-white hover:bg-blue-800">
            Login
          </Button>
        </form>


      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button variant="outline" className="w-full" onClick={() => goToView('phone')}>
          Login with Phone Number
        </Button>
        <Button variant="outline" className="w-full" onClick={() => goToView('email')}>
          Login with Email
        </Button>
      </CardFooter>
    </motion.div>
  )



  const renderPhoneLogin = () => (
    <motion.div key="phone" layout {...animationProps}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign In with Phone</CardTitle>
        <CardDescription>Enter your phone number to receive a login code</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid gap-4">
          <Label htmlFor="phone">Phone Number</Label>
          <PhoneInput
            country={countryCode}
            value={phone}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true,
            }}
            enableSearch={true}
            inputClass="!w-full !h-10 !text-sm"
            containerClass="!w-full"
            buttonStyle={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
          />
        </div>
      </CardContent>


      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button onClick={() => requestOtp({ type: 'phone', id: phone })} className="w-full bg-blue-700 text-white hover:bg-blue-800">
          Send OTP
        </Button>
        <Button variant="ghost" className="w-full text-black-700" onClick={() => goToView('default')}>
          ← Back to Login
        </Button>
      </CardFooter>
    </motion.div>
  )


  const renderEmailLogin = () => (
    <motion.div key="email" layout {...animationProps}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign In with Email</CardTitle>
        <CardDescription>Enter your email to receive a login code</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid gap-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button onClick={() => requestOtp({ type: 'email', id: email })} className="w-full bg-blue-700 text-white hover:bg-blue-800">
          Send OTP
        </Button>
        <Button variant="ghost" className="w-full text-black-700" onClick={() => goToView('default')}>
          ← Back to Login
        </Button>
      </CardFooter>
    </motion.div>
  )

  // const renderOtpInput = () => (
  //   <motion.div key="otp" layout {...animationProps}>
  //     <CardHeader className="text-center">
  //       <CardTitle className="text-2xl font-bold">Enter OTP</CardTitle>
  //       <CardDescription>
  //         {otpType === 'phone'
  //           ? `Code sent to your phone: ${identifier}`
  //           : `Code sent to your email: ${identifier}`}
  //       </CardDescription>
  //     </CardHeader>
  //     <CardContent className="pb-4">
  //       <div className="grid gap-4">
  //         <Label htmlFor="otp">OTP Code</Label>
  //         <Input
  //           id="otp"
  //           placeholder="6-digit code"
  //           value={accessCode}
  //           onChange={(e) => setAccessCode(e.target.value)}
  //         />
  //       </div>
  //     </CardContent>
  //     <CardFooter className="flex flex-col gap-2 pt-2">
  //       <Button
  //         onClick={verifyOtpCode}
  //         disabled={loading}
  //         className="w-full bg-blue-700 text-white"
  //       >
  //         {loading ? 'Verifying...' : 'Verify'}
  //       </Button>
  //       <Button variant="ghost" className="w-full text-blue-700" onClick={() => goToView('default')}>
  //         ← Back to Login
  //       </Button>
  //     </CardFooter>
  //   </motion.div>
  // )

  //   return (
  //   <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
  //     <LoginAlert alert={alert} />
  //     <AnimatePresence mode="wait" initial={false}>
  //       {view === 'otp' ? (
  //         <OtpForm
  //           otpType={otpType}
  //           identifier={identifier}
  //           accessCode={accessCode}
  //           setAccessCode={setAccessCode}
  //           onVerify={verifyOtpCode}
  //           onBack={() => goToView('default')}
  //           loading={loading}
  //         />
  //       ) : (
  //         <Card className="w-full max-w-sm shadow-lg">
  //           <motion.div key={view} layout {...animationProps}>
  //             {view === 'default' && renderDefaultLogin()}
  //             {view === 'phone' && renderPhoneLogin()}
  //             {view === 'email' && renderEmailLogin()}
  //           </motion.div>
  //         </Card>
  //       )}
  //     </AnimatePresence>
  //   </div>
  // )
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginAlert alert={alert} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          layout
          {...animationProps}
          className="w-full max-w-sm"
        >
          {view === 'otp' ? (
            <OtpForm
              otpType={otpType}
              identifier={identifier}
              accessCode={accessCode}
              setAccessCode={setAccessCode}
              onVerify={verifyOtpCode}
              onBack={() => goToView('default')}
              loading={loading}
            />
          ) : (
            <Card className="shadow-lg">
              {view === 'default' && renderDefaultLogin()}
              {view === 'phone' && renderPhoneLogin()}
              {view === 'email' && renderEmailLogin()}
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}