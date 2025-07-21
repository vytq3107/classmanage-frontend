'use client'

import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function SignupForm({ phoneNumber, onSignup, onBack, loading }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = () => {
        if (!username || !password || !confirmPassword) {
            return setError('Please fill in all fields.')
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match.')
        }

        setError(null)
        onSignup({ username, password, phoneNumber })
    }

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
                        Complete Signup
                    </CardTitle>
                    <CardDescription>
                        Create your account using phone: {phoneNumber}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                </CardContent>


                <CardFooter className="flex flex-col gap-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-700 text-white hover:bg-blue-800"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-black-700"
                        onClick={onBack}
                    >
                        ← Back
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
