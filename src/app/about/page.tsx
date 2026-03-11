import { Navbar } from '@/components/layout/navbar'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Heart, Shield } from 'lucide-react'

export default function AboutPage() {
    return (
        <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#fdfbf7]">
            {/* Background Image */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <Image
                    src="/images/about_bg.png"
                    alt="Crescent Moon Cocker Spaniels home environment background"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="bg-primary-950 pb-20 pt-6 rounded-b-[3rem] shadow-xl relative z-40">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-16 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg tracking-wide">About Crescent Moon</h1>
                    <p className="text-xl md:text-2xl text-primary-200 font-light max-w-2xl mx-auto leading-relaxed">
                        A passion for the breed, a commitment to health, and a dedication to matching families with their perfect companion.
                    </p>
                </div>
            </div>

            <section className="flex-grow max-w-6xl mx-auto px-6 py-20 w-full -mt-10 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100 flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                        <div className="relative w-full aspect-[4/5]">
                            <div className="w-full h-full relative p-4">
                                <img
                                    src="https://images.unsplash.com/photo-1610474660855-32e67df66e37?w=800&q=80"
                                    alt="A happy English Cocker Spaniel puppy from Crescent Moon"
                                    className="w-full h-full object-cover rounded-[2rem]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 space-y-8">
                        <div>
                            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">Our Story</h3>
                            <h2 className="text-4xl font-serif text-primary-950">Over 15 Years of Excellence</h2>
                        </div>

                        <p className="text-gray-700 leading-relaxed text-lg">
                            Nestled in the rolling hills, Crescent Moon Cocker Spaniels began as a small family endeavor. We fell in love with the gentle, affectionate, and merry nature of the Cocker Spaniel over two decades ago.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            What started as a passion quickly blossomed into a dedicated breeding program. We don't run a kennel; our dogs live in our home, sleep on our couches, and are a central part of our daily lives. This home-raised environment is the secret to our puppies' incredible temperaments.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4 items-start">
                                <CheckCircle2 className="w-6 h-6 text-accent-green shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-serif text-xl text-primary-900">Ethical Breeding</h4>
                                    <p className="text-gray-600 text-sm mt-1">We strictly adhere to ethical breeding standards, focusing on the betterment of the breed rather than volume.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Heart className="w-6 h-6 text-accent-green shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-serif text-xl text-primary-900">Socialization First</h4>
                                    <p className="text-gray-600 text-sm mt-1">From day one, puppies are introduced to household sounds, children, and other pets using early neurological stimulation (ENS).</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Shield className="w-6 h-6 text-accent-green shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-serif text-xl text-primary-900">Lifelong Support</h4>
                                    <p className="text-gray-600 text-sm mt-1">When you take a puppy home, you join the Crescent Moon family. We offer lifetime breeder support for all our adoptive families.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <div>
                            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">Our Environment</h3>
                            <h2 className="text-4xl font-serif text-primary-950">A Home, Not a Kennel</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            We pride ourselves on providing a radically different upbringing for our dogs. There are no outdoor kennels or concrete runs here. Our dedicated puppy nursery is situated right next to our family room, meaning the puppies hear televisions, vacuums, dropping pots, and laughing children from the moment their ears open.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            We have acres of securely fenced, lush grassy land where our adult dogs run, play, and explore daily. We believe that a happy, structurally sound, and joyful adult dog produces the best quality puppies.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1628102431526-9f33b1e326c5?w=800&q=80"
                                alt="Cocker Spaniel puppies playing in our lush clover fields"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-20 relative z-20 text-center">
                <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-4">Meet the Breeder</h3>
                <h2 className="text-4xl font-serif text-primary-950 mb-8">Hi, I'm Ellie</h2>
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-md mb-8 border-4 border-white">
                    <img src="https://images.unsplash.com/photo-1601412438531-5916ed331c35?w=800&q=80" alt="Ellie, the dedicated English Cocker Spaniel breeder at Crescent Moon" className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6 max-w-2xl mx-auto">
                    Breeding Cocker Spaniels has been the greatest joy of my life. I am intensely passionate about the health, genetics, and conformation of this breed. I spend countless hours researching pedigrees, studying genetic health testing, and consulting with reproductive specialists to ensure every Crescent Moon puppy is structurally and mentally sound.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg max-w-2xl mx-auto">
                    When you adopt from me, you are not just getting a puppy; you are getting a piece of my heart and a lifetime of commitment from me as your breeder.
                </p>
            </section>

            <div className="bg-primary-50 py-24 px-6 mt-12 w-full text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-serif text-primary-950">Ready to Meet Your New Best Friend?</h2>
                    <p className="text-xl text-gray-700">Browse our available litters or contact us to join our exclusive waitlist for upcoming arrivals.</p>
                    <div className="flex justify-center gap-6 pt-4">
                        <Link href="/browse" className="bg-primary-700 hover:bg-primary-600 text-white font-medium py-4 px-10 rounded-full shadow-xl transition-all hover:-translate-y-1">
                            View Available Puppies
                        </Link>
                        <Link href="/contact" className="bg-white hover:bg-gray-50 text-primary-700 font-medium py-4 px-10 rounded-full shadow-xl transition-all border border-gray-200 hover:-translate-y-1">
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
