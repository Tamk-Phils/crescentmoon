'use client'

import Link from 'next/link'
import { Search, Menu, X, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import Image from 'next/image'

export function Navbar() {
    const [session, setSession] = useState<Session | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        setIsMenuOpen(false)
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About Us' },
        { href: '/browse', label: 'Available Dogs' },
        { href: '/faq', label: 'FAQ' },
        { href: '/care-and-training', label: 'Care & Training' },
        { href: '/contact', label: 'Contact' },
    ]

    return (
        <nav className="w-full relative z-50 py-4 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-primary-200/20 group-hover:border-primary-100/40 transition-all shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="Crescent Moon Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-white font-serif text-lg md:text-2xl tracking-wide drop-shadow-md block">
                        Crescent Moon
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8 text-white/90 font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-white transition-colors relative group py-2"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-300 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden lg:flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition-all backdrop-blur-sm border border-white/10"
                            >
                                <User size={18} />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-white transition-all border border-white/5"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-white hover:text-primary-100 transition-colors font-semibold">
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-primary-50 text-primary-950 px-6 py-2.5 rounded-full hover:bg-white transition-all font-bold shadow-xl border border-primary-100"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-primary-950/95 backdrop-blur-xl border-t border-white/10 shadow-2xl lg:hidden overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-white text-lg font-medium hover:text-primary-200 transition-colors py-2 border-b border-white/5"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="mt-4 flex flex-col gap-3">
                                {session ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="bg-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <User size={20} /> Dashboard
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="bg-red-500/10 text-red-400 py-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={20} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-white text-center py-3 border border-white/20 rounded-xl"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="bg-white text-primary-950 text-center py-3 rounded-xl font-bold"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
