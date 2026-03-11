'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, MessageCircleQuestion } from 'lucide-react'
import Image from 'next/image'

export default function ContactPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await fetch('/api/notify-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    data: { name, email, message }
                })
            })
            setSubmitted(true)
        } catch (err) {
            console.error("Failed to send notification:", err)
            // Still show success to user or handle error
            setSubmitted(true)
        }
    }

    return (
        <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#e6e2f0]">
            {/* Background Image */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <Image
                    src="/images/contact_bg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="bg-primary-950 pb-20 pt-6 rounded-b-[3rem] shadow-xl relative z-10">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-16 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg tracking-wide">Get In Touch</h1>
                    <p className="text-xl md:text-2xl text-primary-200 font-light max-w-2xl mx-auto leading-relaxed">
                        Have questions about our puppies or the adoption process? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-6xl mx-auto px-6 py-20 w-full -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Contact Information & FAQs */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-serif text-primary-950 mb-6">Contact Info</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Email Us</p>
                                        <p className="text-gray-900">hello@crescentmoonspaniels.com</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Call Us</p>
                                        <p className="text-gray-900">(555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Location</p>
                                        <p className="text-gray-900">Portland, Oregon</p>
                                        <p className="text-xs text-gray-400 mt-1">Visits by approved appointment only.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent-green/20 rounded-[2rem] p-8 border border-accent-green/30">
                            <div className="flex items-center gap-3 mb-4">
                                <MessageCircleQuestion className="w-6 h-6 text-primary-700" />
                                <h3 className="text-xl font-serif text-primary-950">Quick Facts</h3>
                            </div>
                            <ul className="space-y-4 text-sm text-gray-700">
                                <li><strong className="text-primary-900 block mb-1">Do you ship puppies?</strong> Yes, we offer safe flight nannies nationwide for an additional fee.</li>
                                <li><strong className="text-primary-900 block mb-1">What is the adoption fee?</strong> Our standard adoption fee ranges from $2,000 to $3,500 depending on pedigree and coloring.</li>
                                <li><strong className="text-primary-900 block mb-1">Is there a deposit?</strong> A $500 non-refundable deposit is required to hold a puppy or join the waitlist.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-gray-100 h-full">
                            {submitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                        <Send className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-serif text-primary-950 mb-4">Message Sent!</h2>
                                    <p className="text-lg text-gray-600 max-w-md mb-8">
                                        Thank you for reaching out. We have received your message and will get back to you within 24-48 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-primary-600 font-medium hover:text-primary-800 transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-serif text-primary-950 mb-8">Send us a message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all shadow-sm"
                                                    placeholder="Jane Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all shadow-sm"
                                                    placeholder="jane@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">How can we help you?</label>
                                            <textarea
                                                required
                                                rows={6}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all shadow-sm resize-none"
                                                placeholder="I'm interested in..."
                                            ></textarea>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full md:w-auto px-10 py-4 bg-primary-700 hover:bg-primary-600 text-white font-medium rounded-full shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2"
                                            >
                                                <Send className="w-5 h-5" /> Send Message
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Area */}
            <footer className="w-full relative z-20 bg-[#5d5955] text-white py-16 px-8 rounded-t-[3rem] -mt-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-3xl font-serif mb-4">Crescent Moon</h3>
                            <p className="text-gray-300 max-w-sm mb-6 leading-relaxed">
                                Dedicated to breeding healthy, beautifully-tempered Cocker Spaniels. Connecting puppies with their loving forever homes.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-lg mb-4 text-white/90">Quick Links</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/browse" className="hover:text-white transition-colors">Available Puppies</Link></li>
                                <li><Link href="/about" className="hover:text-white transition-colors">About the Breeder</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-lg mb-4 text-white/90">Contact</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li>hello@crescentmoonspaniels.com</li>
                                <li>(555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-600/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <p>Copyright © {new Date().getFullYear()} Crescent Moon Cocker Spaniels. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    )
}
