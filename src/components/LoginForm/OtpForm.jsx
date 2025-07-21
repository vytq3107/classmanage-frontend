'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

// Animation style: fade in + slide up
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function OtpForm({
  otpType,
  identifier,
  accessCode,
  setAccessCode,
  onVerify,
  onBack,
  loading,
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={fadeInUp}
      className="w-full max-w-sm"
    >
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle as="h1" className="text-2xl font-bold">
            Enter OTP
          </CardTitle>
          <CardDescription>
            {otpType === 'phone'
              ? `Code sent to your phone: ${identifier}`
              : `Code sent to your email: ${identifier}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              placeholder="6-digit code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={onVerify}
            disabled={loading}
            className="w-full bg-blue-700 text-white hover:bg-blue-800"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-black-700"
            onClick={onBack}
          >
            ← Back to Login
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
