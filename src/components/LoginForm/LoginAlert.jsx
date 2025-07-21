'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoginAlert({ alert }) {
  if (!alert) return null

  const isError = alert.type === 'error'
  const Icon = isError ? AlertCircleIcon : CheckCircle2Icon
  const variant = isError ? 'destructive' : 'default'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-50 w-[320px]"
      >
        <Alert variant={variant} className="shadow-md">
          <Icon className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}
