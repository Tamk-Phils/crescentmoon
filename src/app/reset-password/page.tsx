'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Dog } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Password updated successfully! You can now sign in.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#fdfbf7] p-6 overflow-hidden">
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center text-primary-200">
                        <Dog className="w-8 h-8" />
                    </div>
                </div>

                <h2 className="text-3xl font-serif text-center text-primary-950 mb-2">Update Password</h2>
                <p className="text-center text-gray-500 mb-8 font-light max-w-xs mx-auto">
                    Enter your new password below.
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 text-center">
                        {error}
                    </div>
                )}

                {message ? (
                    <div className="text-center space-y-6">
                        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-100 text-center">
                            {message}
                        </div>
                        <Link href="/login" className="inline-block w-full py-4 px-6 bg-primary-900 hover:bg-primary-800 text-white rounded-2xl font-medium shadow-xl shadow-primary-900/20 transition-all hover:-translate-y-0.5">
                            Go to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-primary-900 mb-2 pl-1">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all text-gray-800"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 bg-primary-900 hover:bg-primary-800 text-white rounded-2xl font-medium shadow-xl shadow-primary-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
