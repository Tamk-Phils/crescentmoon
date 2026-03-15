'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Dog } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Hardcoded admin access as requested - but attempt real login first for RLS support
        if (email.toLowerCase() === 'support@crescentmooncocker.com' && password === 'Phil$7872') {
            try {
                // Try to get a real session for RLS functionality
                await supabase.auth.signInWithPassword({ email, password })
                localStorage.setItem('crescent_admin_logged_in', 'true')
                router.push('/admin')
                return
            } catch (e) {
                // Fallback to bypass if user doesn't exist in Supabase yet
                localStorage.setItem('crescent_admin_logged_in', 'true')
                router.push('/admin')
                return
            }
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#e6e2f0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-primary-900/60 hover:text-primary-900 transition-colors group z-50 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium font-inter">Back to Home</span>
                </Link>
            </motion.div>

            {/* Decorative background circle */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-200 blur-3xl opacity-50 pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent-green blur-3xl opacity-40 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <Link href="/" className="flex justify-center text-primary-900 mb-6 hover:scale-110 transition-transform duration-300">
                    <div className="bg-white/40 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/50">
                        <Dog className="w-12 h-12" />
                    </div>
                </Link>
                <h2 className="mt-2 text-center text-5xl font-serif tracking-tight text-primary-950">
                    Welcome back
                </h2>
                <p className="mt-3 text-center text-base text-primary-800/80 font-inter">
                    Or{' '}
                    <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors underline-offset-4 hover:underline">
                        create a new account
                    </Link>
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="bg-white/60 backdrop-blur-xl py-10 px-6 shadow-2xl sm:rounded-[2.5rem] sm:px-12 border border-white/80">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-primary-900 ml-1 mb-1 font-inter">
                                Email address
                            </label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-12 pr-4 py-4 border-none bg-white/50 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 sm:text-sm transition-all font-inter"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary-900 ml-1 mb-1 font-inter">
                                Password
                            </label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-12 pr-4 py-4 border-none bg-white/50 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 sm:text-sm transition-all font-inter"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-500 text-sm bg-red-50/80 backdrop-blur-sm p-4 rounded-xl border border-red-100 font-inter"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-base font-semibold text-white bg-primary-700 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed font-inter"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
