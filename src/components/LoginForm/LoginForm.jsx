'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './LoginForm.module.css'
import { LoginFormPhone } from '../OtpPhoneForm/OtpPhoneForm'
import { LoginFormEmail } from '../OtpEmailForm/OtpEmailForm'
import { LoginFormContent } from './LoginFormContent'

export function LoginForm() {
  const [mode, setMode] = useState('username')

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {mode === 'username' && (
          <motion.div
            key="username"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <LoginFormContent setMode={setMode} />
          </motion.div>
        )}

        {mode === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <LoginFormPhone setMode={setMode} />
          </motion.div>
        )}

        {mode === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <LoginFormEmail setMode={setMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
