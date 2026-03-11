import { Navbar } from '@/components/layout/navbar'
import { Bone, Scissors, Brain, HeartPulse, Activity, ShieldPlus } from 'lucide-react'
import Image from 'next/image'

export default function CareAndTrainingPage() {
    return (
        <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#fdfbf7]">
            <div className="bg-primary-950 pb-20 pt-6 rounded-b-[3rem] shadow-xl relative z-10">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-16 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg tracking-wide">Care & Training</h1>
                    <p className="text-xl md:text-2xl text-primary-200 font-light max-w-2xl mx-auto leading-relaxed">
                        Setting your new Cocker Spaniel up for a healthy, happy, and long life.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-6xl mx-auto px-6 py-20 w-full -mt-10 relative z-20 space-y-24">

                {/* Introduction Section */}
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100 flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                        <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg">
                            <Image
                                src="/images/care_hero.png"
                                alt="Cocker Spaniel Puppy at Home"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h3 className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">Welcome Home</h3>
                        <h2 className="text-4xl font-serif text-primary-950">The First Few Weeks</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Bringing your new puppy home is incredibly exciting, but it can also be overwhelming for your new family member. The key to a successful transition is establishing a calm, consistent routine.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            We strongly recommend utilizing a crate for nap times and overnight sleeping. Crate training provides your puppy with a safe, secure den, and greatly expedites the potty-training process. Expect a few sleepless nights at first, but consistency will pay off quickly!
                        </p>
                        <div className="bg-primary-50 p-6 rounded-2xl mt-4">
                            <h4 className="font-serif text-primary-900 font-semibold mb-2">Pro Tip:</h4>
                            <p className="text-sm text-gray-700">Keep visitors to a minimum for the first 3-5 days to allow your puppy time to decompress and bond exclusively with their new immediate family.</p>
                        </div>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="text-center">
                    <h2 className="text-4xl font-serif text-primary-950 mb-4">The Three Pillars of Care</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">Every Crescent Moon spaniel relies on you to master these fundamentals.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {/* Nutrition */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                                <Bone className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif text-primary-950 mb-4">Nutrition</h3>
                            <p className="text-gray-600 leading-relaxed text-sm mb-4">
                                Cocker Spaniels are notorious foodies! They thrive on a balanced, high-protein diet, but their love for food makes them highly susceptible to obesity.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700 pl-4 list-disc marker:text-primary-400">
                                <li><strong>Puppy Food:</strong> Purina Pro Plan High Protein Puppy (until 12 months)</li>
                                <li><strong>Measurements:</strong> Strictly adhere to feeding charts; do not free-feed.</li>
                                <li><strong>Treats:</strong> Keep treats to less than 10% of their daily caloric intake. Use training kibble instead!</li>
                            </ul>
                        </div>

                        {/* Grooming */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                                <Scissors className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif text-primary-950 mb-4">Grooming & Hygiene</h3>
                            <p className="text-gray-600 leading-relaxed text-sm mb-4">
                                Their signature silky coat and long, heavily feathered ears require absolute dedication. Neglecting grooming leads to painful matting.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700 pl-4 list-disc marker:text-primary-400">
                                <li><strong>Daily:</strong> Thorough brushing with a slicker brush and metal comb to prevent tangles.</li>
                                <li><strong>Ears:</strong> Check and wipe clean weekly. Use a vet-approved drying solution after baths or swimming to prevent yeast infections.</li>
                                <li><strong>Professional:</strong> Schedule a groomer every 6-8 weeks for a trim.</li>
                            </ul>
                        </div>

                        {/* Training */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                                <Brain className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif text-primary-950 mb-4">Puppy Training</h3>
                            <p className="text-gray-600 leading-relaxed text-sm mb-4">
                                Cockers are sensitive souls. They respond remarkably well to positive reinforcement (treats, praise, play) and shut down if corrected harshly.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700 pl-4 list-disc marker:text-primary-400">
                                <li><strong>Socialization:</strong> Introduce them to 100 different people, surfaces, and sounds before they are 16 weeks old.</li>
                                <li><strong>Bite Inhibition:</strong> Redirect nipping to a toy immediately.</li>
                                <li><strong>Classes:</strong> We mandate group puppy obedience classes starting around 14 weeks.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Deep Dive Sections */}
                <div className="space-y-16">
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center bg-accent-green/20 rounded-3xl p-8 md:p-12">
                        <div className="md:w-5/12">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg relative border-4 border-white">
                                <Image src="/images/care_training.png" alt="Training Cocker Spaniel" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="md:w-7/12 space-y-4 text-gray-800">
                            <div className="flex items-center gap-3 text-primary-700 mb-2">
                                <Activity className="w-6 h-6" />
                                <h3 className="text-2xl font-serif font-semibold">Exercise Needs</h3>
                            </div>
                            <p>Despite their elegant appearance, Cocker Spaniels are sporting dogs bred for strenuous activity. A short walk around the block is rarely enough.</p>
                            <p>Aim for at least <strong>60 minutes of moderate exercise</strong> daily once fully grown. This could include long walks, hiking, fetching, or vigorous play sessions. Mental stimulation is equally important; interactive puzzle toys or 15-minute focused training sessions will exhaust them just as much as a run!</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 items-center bg-primary-50 rounded-3xl p-8 md:p-12">
                        <div className="md:w-5/12">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg relative border-4 border-white">
                                <Image src="/images/care_grooming.png" alt="Groomed Cocker Spaniel" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="md:w-7/12 space-y-4 text-gray-800">
                            <div className="flex items-center gap-3 text-primary-700 mb-2">
                                <HeartPulse className="w-6 h-6" />
                                <h3 className="text-2xl font-serif font-semibold">Health Monitoring</h3>
                            </div>
                            <p>Because you are their advocate, you must know what "normal" looks like for your dog. Your Crescent Moon puppy has been thoroughly vetted, but preventative care is your responsibility.</p>
                            <p>Ensure you keep up fully with their vaccination schedules and heartworm/flea prevention. Schedule an annual wellness exam with your vet. Specifically monitor their eyes for cloudiness (as the breed can be prone to cataracts in old age) and maintain strict dental hygiene with daily brushing to prevent periodontal disease.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}
