import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'
import { Plane, Car, AlertCircle } from 'lucide-react'

export default function ShippingPage() {
    return (
        <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#fdfbf7]">
            <div className="bg-primary-950 pb-16 pt-6 rounded-b-[3rem] shadow-xl relative z-40">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-12 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-lg tracking-wide">Shipping & Transport</h1>
                    <p className="text-lg text-primary-200 font-light max-w-2xl mx-auto mb-8">
                        How we safely unite our puppies with families across the country.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-5xl mx-auto px-6 py-16 w-full -mt-10 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                                <Plane className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-serif text-primary-950">Flight Nanny Service</h2>
                            <p className="text-gray-700 leading-relaxed">
                                For families outside our local driving radius, we offer a dedicated Flight Nanny service. A trusted professional will fly in the cabin with your puppy, ensuring they are comforted, fed, and safe throughout the entire journey.
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex gap-2 items-start"><span className="text-primary-500">•</span> Typically ranges from $450 - $700 depending on location.</li>
                                <li className="flex gap-2 items-start"><span className="text-primary-500">•</span> Puppy flies in-cabin, never in cargo.</li>
                                <li className="flex gap-2 items-start"><span className="text-primary-500">•</span> You meet the nanny at your closest major airport.</li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                                <Car className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-serif text-primary-950">Local Pick-up & Ground Transport</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We strongly encourage families to pick up their puppies directly from our home. This gives you the opportunity to meet the parent dogs, see where your puppy was raised, and ask any final questions in person.
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex gap-2 items-start"><span className="text-primary-500">•</span> Local pick-up is always free.</li>
                                <li className="flex gap-2 items-start"><span className="text-primary-500">•</span> We can meet families halfway for a standard mileage fee (up to 300 miles).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 bg-red-50 border border-red-100 rounded-2xl p-6 flex gap-4">
                        <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                        <div>
                            <h3 className="font-serif text-xl text-red-900 mb-2">Strict No-Cargo Policy</h3>
                            <p className="text-red-700 leading-relaxed">
                                Under absolutely no circumstances do we ship our puppies via cargo in the belly of an airplane. The stress and risk to the puppy's health are entirely unacceptable to our breeding program.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
