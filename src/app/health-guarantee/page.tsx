import { Navbar } from '@/components/layout/navbar'
import { ShieldCheck, Stethoscope, FileSignature } from 'lucide-react'

export default function HealthGuaranteePage() {
    return (
        <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#fdfbf7]">
            <div className="bg-primary-950 pb-16 pt-6 rounded-b-[3rem] shadow-xl relative z-10">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-12 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-lg tracking-wide">Health Guarantee</h1>
                    <p className="text-lg text-primary-200 font-light max-w-2xl mx-auto mb-8">
                        Our comprehensive 2-year genetic health promise.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full -mt-10 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100 text-gray-700 leading-relaxed space-y-8">

                    <div className="flex items-center gap-4 mb-8">
                        <ShieldCheck className="w-12 h-12 text-accent-green" />
                        <h2 className="text-3xl font-serif text-primary-950 m-0">Our 2-Year Promise</h2>
                    </div>

                    <p>
                        We take immense pride in the health and vitality of our Cocker Spaniels. Because we rigorously health test our parent dogs, we are confident in offering a strict two-year genetic health guarantee against severely life-altering or life-threatening hereditary congenital defects.
                    </p>

                    <h3 className="text-xl font-serif text-primary-900 mt-8 mb-4 border-b pb-2">What is Covered</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Severe Hip Dysplasia requiring surgery.</li>
                        <li>Progressive Retinal Atrophy (PRA) resulting in blindness.</li>
                        <li>Severe heart murmurs causing physical impairment (Grade 4 or above).</li>
                        <li>Other life-threatening genetic defects proven to be congenital.</li>
                    </ul>

                    <div className="bg-primary-50 p-6 rounded-2xl flex gap-4 my-8 items-start">
                        <Stethoscope className="w-8 h-8 text-primary-600 shrink-0" />
                        <div>
                            <h4 className="font-medium text-primary-900 mb-1">Veterinary Condition</h4>
                            <p className="text-sm">To validate this guarantee, the buyer must have the puppy examined by a licensed veterinarian within 72 hours of taking possession. Failure to do so voids all guarantees.</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-serif text-primary-900 mt-8 mb-4 border-b pb-2">What is Not Covered</h3>
                    <p>
                        This guarantee does not cover common canine issues such as parasites (worms, giardia, coccidia), viral illnesses, bacterial infections, umbilical hernias, base narrow canines, un-descended testicles, allergies, cherry eye, or any environmental factors out of the breeder's control.
                    </p>

                    <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl flex gap-4 mt-8 items-start">
                        <FileSignature className="w-8 h-8 text-gray-500 shrink-0" />
                        <div>
                            <h4 className="font-medium text-secondary-900 mb-1">Formal Contract</h4>
                            <p className="text-sm">A formal, legally binding contract outlining these exact terms will be signed by both the breeder and the buyer prior to the puppy leaving our care.</p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
