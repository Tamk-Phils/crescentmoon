'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { DogCard } from '@/components/ui/dog-card'
import { Search, Heart, ShieldCheck, Award, ThumbsUp, ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [puppies, setPuppies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPuppies() {
      const { data } = await supabase
        .from('puppies')
        .select('*')
        .eq('status', 'available')
        .limit(3)

      if (data) setPuppies(data)
      setLoading(false)
    }
    fetchPuppies()
  }, [])

  return (
    <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#e6e2f0]">
      {/* Hero Image / Background */}
      <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:bg-black/30">
        <div
          className="w-full h-full bg-cover bg-[center_top] bg-no-repeat transition-transform duration-[20s] ease-in-out hover:scale-105"
          style={{ backgroundImage: 'url("/images/hero.png")' }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center pt-16 pb-40 px-6"
      >
        <h1 className="text-white text-5xl md:text-8xl font-serif text-center mt-6 drop-shadow-xl tracking-wide max-w-[90vw]">
          Crescent Moon Cocker Spaniels
        </h1>
        <h2 className="text-white text-3xl md:text-5xl font-sans font-light mt-4 mb-10 text-center drop-shadow-md">
          Premium Cocker Spaniel Puppies
        </h2>

        <p className="max-w-xl text-center text-white/90 text-lg md:text-xl mb-12 font-medium">
          Connecting loving families with beautifully bred, healthy, and happy Cocker Spaniel puppies across the nation.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for your next best friend..."
            className="w-full pl-14 pr-6 py-5 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-2xl text-lg font-medium transition-all"
          />
        </div>
      </motion.div>

      {/* Main Content Gradient Background with Top Curve */}
      <div className="relative z-10 flex-grow bg-gradient-to-b from-[#e6e2f0] via-[#f7f6f1] to-[#fdfbf7] rounded-t-[40px] md:rounded-t-[50%] -mt-24 pt-32 pb-24 px-6 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto mb-32 pt-8"
        >
          <div className="text-center mb-16">
            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Our Promise</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-950">Why Crescent Moon?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 text-center shadow-lg border border-white">
              <div className="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif text-primary-900 mb-3">Raised With Love</h4>
              <p className="text-gray-600 leading-relaxed">Our puppies are born and raised inside our home, surrounded by everyday life, ensuring they are perfectly socialized and ready for your family.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 text-center shadow-lg border border-white">
              <div className="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif text-primary-900 mb-3">Health Guaranteed</h4>
              <p className="text-gray-600 leading-relaxed">Every puppy comes with a comprehensive 2-year genetic health guarantee, first vaccinations, and a certified veterinarian health check.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 text-center shadow-lg border border-white">
              <div className="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif text-primary-900 mb-3">Champion Bloodlines</h4>
              <p className="text-gray-600 leading-relaxed">We breed for exceptional temperament and beautiful conformation, carefully selecting champion pedigrees to ensure the highest quality spaniels.</p>
            </div>
          </div>
        </motion.div>

        {/* Featured Dogs Section */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="flex flex-col items-center mb-16">
            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Meet The Puppies</h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary-950 text-center">
              Our Available Dogs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full place-items-center mb-12">
            {loading ? (
              <div className="col-span-full py-20 text-center text-gray-500 font-serif italic">Loading adorable puppies...</div>
            ) : puppies.length > 0 ? (
              puppies.map((dog, idx) => (
                <motion.div
                  key={dog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                >
                  <DogCard
                    id={dog.id}
                    name={dog.name}
                    description={`${dog.gender} • ${dog.age} • ${dog.breed}`}
                    imageUrl={dog.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80'}
                    images={dog.images}
                    variant={idx % 2 === 0 ? 'white' : 'green'}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 font-serif italic text-xl">
                No puppies available right now. Please check back soon or contact us to join our waiting list!
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/browse" className="inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-medium py-4 px-10 rounded-full shadow-xl transition-all hover:-translate-y-1">
              View All Puppies <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* The Breed Section */}
        <section className="max-w-6xl mx-auto mb-32 bg-white rounded-3xl p-10 md:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm">Breed Spotlight</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-primary-950">The Cocker Spaniel Personality</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Known as the "merry" cocker, these charming dogs are famous for their ever-wagging tails and gentle, affectionate nature. They are highly adaptable, making them fantastic companions for singles, couples, and bustling families alike.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Cocker Spaniels are intelligent and eager to please, which means they take to training beautifully. Whether you're looking for a hiking buddy, a snuggle partner for movie nights, or a playful friend for your children, the Cocker Spaniel brings an abundance of joy into any home.
            </p>
            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-accent-green w-5 h-5" /> <span className="text-gray-800 font-medium">Affectionate & Loyal</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-accent-green w-5 h-5" /> <span className="text-gray-800 font-medium">Highly Trainable</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-accent-green w-5 h-5" /> <span className="text-gray-800 font-medium">Excellent with Children</span></li>
            </ul>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-primary-200 rounded-full blur-3xl opacity-30 transform translate-x-10 translate-y-10"></div>
            <div className="w-full aspect-square relative rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
              <Image
                src="/images/featured_2.png"
                alt="A beautiful adult Cocker Spaniel showing the breed's standard coat and friendly expression"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Meet the Breed Gallery */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Diversity of the Breed</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-950">Beautiful Variety</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">From Golden to Blue Roan, explore the stunning colors and patterns that make Cocker Spaniels world-famous.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { src: '/images/breed_gallery/1.png', title: 'Golden Cocker Spaniel' },
              { src: '/images/breed_gallery/2.png', title: 'Black & White Cocker Spaniel' },
              { src: '/images/breed_gallery/3.png', title: 'Liver & Tan Cocker Spaniel' },
              { src: '/images/breed_gallery/4.png', title: 'Blue Roan Cocker Spaniel' },
              { src: '/images/breed_gallery/5.png', title: 'Red Cocker Spaniel' },
              { src: '/images/breed_gallery/6.png', title: 'Parti-color Cocker Spaniel' },
            ].map((img, idx) => (
              <div key={idx} className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                <Image src={img.src} alt={img.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-serif text-xl">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Simple & Transparent</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-950">How Adoption Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
                <span className="text-3xl font-serif text-primary-800">1</span>
              </div>
              <h4 className="text-xl font-serif text-primary-950 mb-3">Browse Puppies</h4>
              <p className="text-gray-600 text-sm leading-relaxed">View our currently available litters and find the puppy that speaks to your heart.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
                <span className="text-3xl font-serif text-primary-800">2</span>
              </div>
              <h4 className="text-xl font-serif text-primary-950 mb-3">Submit Application</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Fill out a brief application and place a small deposit to reserve your chosen puppy.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
                <span className="text-3xl font-serif text-primary-800">3</span>
              </div>
              <h4 className="text-xl font-serif text-primary-950 mb-3">Breeder Review</h4>
              <p className="text-gray-600 text-sm leading-relaxed">We review your application to ensure a perfect fit and approve your adoption request.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
                <span className="text-3xl font-serif text-primary-800">4</span>
              </div>
              <h4 className="text-xl font-serif text-primary-950 mb-3">Take Home</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Arrange travel or pickup, complete the final payment, and welcome your new family member!</p>
            </div>
          </div>
        </div>

        {/* Testimonial / Story Section */}
        <div className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Happy Families</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-950">Hear From Our Adopters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-800">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <ThumbsUp className="w-8 h-8 text-primary-400 mx-auto mb-4" />
              <p className="italic mb-6">"We adopted our sweet Bella from Crescent Moon last year, and she has completely transformed our home. Her temperament is incredibly gentle and wonderfully smart."</p>
              <p className="font-serif text-primary-900 font-medium">— The Harrison Family, TX</p>
            </div>
            <div className="bg-accent-green/20 rounded-3xl p-8 shadow-sm scale-105 transform">
              <ThumbsUp className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <p className="italic mb-6 font-medium text-gray-900">"The best breeder we have ever worked with! Our puppy arrived perfectly healthy and practically potty-trained. They answered every question we had and made the entire process so very special."</p>
              <p className="font-serif text-primary-950 font-medium text-lg">— Sarah & Mark J., FL</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <ThumbsUp className="w-8 h-8 text-primary-400 mx-auto mb-4" />
              <p className="italic mb-6">"Charlie is the light of our lives! He has such a calm and loving demeanor. It's obvious he was raised inside a loving home and socialized early. Highly recommend."</p>
              <p className="font-serif text-primary-900 font-medium">— The Miller Family, NY</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Area */}
      <footer className="w-full relative z-20 bg-[#5d5955] text-white py-16 px-8 rounded-t-[40px] md:rounded-t-[30%] -mt-16">
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
                <li>support@crescentmooncocker.com</li>
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
