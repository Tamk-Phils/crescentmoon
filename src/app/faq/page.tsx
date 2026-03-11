import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Image from 'next/image'

export default function FAQPage() {
    const faqs = [
        {
            question: "How does the adoption process work?",
            answer: "First, you'll need to fill out an adoption application. Once approved, you can place a $500 fully refundable deposit to join our waitlist or reserve an available puppy. We'll keep you updated with photos and videos until they are ready to go home at 8 weeks."
        },
        {
            question: "Are your puppies health tested?",
            answer: "Yes, all our parent dogs undergo extensive genetic health testing and OFA certifications before breeding. Every puppy comes with a 2-year genetic health guarantee, their first set of vaccinations, and a veterinarian health certificate."
        },
        {
            question: "Do you ship your puppies?",
            answer: "We prefer families to pick up their puppies in person, but we do offer flight nanny services for an additional fee. We do not ship puppies cargo under any circumstances."
        },
        {
            question: "What is included with my puppy?",
            answer: "Your puppy will come with a welcome pack that includes a blanket with their mother's scent, a small bag of their current food, their health records, registration paperwork (if applicable), and 30 days of free pet insurance."
        },
        {
            question: "Do you offer breeding rights?",
            answer: "Our puppies are sold as pets on strict spay/neuter contracts. Breeding rights are rarely offered and only to established, ethical breeding programs after rigorous vetting."
        }
    ]

    return (
        <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#fdfbf7]">
            {/* Background Image */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <Image
                    src="/images/faq_bg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="bg-primary-950 pb-16 pt-6 rounded-b-[3rem] shadow-xl relative z-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-12 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-lg tracking-wide">Frequently Asked Questions</h1>
                    <p className="text-lg text-primary-200 font-light max-w-2xl mx-auto mb-8">
                        Answers to common questions about our breeding program and adoption process.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full -mt-10 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100 flex flex-col gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <h3 className="text-xl font-serif text-primary-950 mb-3 flex items-start gap-3">
                                <span className="text-primary-400 mt-1"><Plus className="w-5 h-5" /></span>
                                {faq.question}
                            </h3>
                            <p className="text-gray-700 leading-relaxed ml-8">{faq.answer}</p>
                        </div>
                    ))}

                    <div className="mt-8 text-center bg-primary-50 p-8 rounded-2xl">
                        <h4 className="text-lg font-serif text-primary-950 mb-2">Still have questions?</h4>
                        <p className="text-gray-600 mb-6">We're always here to help. Reach out to us directly.</p>
                        <Link href="/contact" className="inline-block bg-primary-700 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
                            Contact Us
                        </Link>
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
