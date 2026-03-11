'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/layout/navbar'
import Image from 'next/image'
import { FileText, CheckCircle2 } from 'lucide-react'

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [puppy, setPuppy] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // Form states - Applicant Information
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [contactMethod, setContactMethod] = useState('email')
    const [address, setAddress] = useState('')

    // Form states - Household & Lifestyle
    const [residenceType, setResidenceType] = useState('house')
    const [rentOrOwn, setRentOrOwn] = useState('own')
    const [householdMembers, setHouseholdMembers] = useState('')
    const [otherPets, setOtherPets] = useState('')
    const [yardDescription, setYardDescription] = useState('')

    // Form states - Employment & Availability
    const [occupation, setOccupation] = useState('')
    const [workHours, setWorkHours] = useState('')
    const [daytimeCare, setDaytimeCare] = useState('')

    // Form states - Puppy Preferences
    const [breedPreference, setBreedPreference] = useState('Bichon Frise')
    const [agePreference, setAgePreference] = useState('no-preference')
    const [genderPreference, setGenderPreference] = useState('no-preference')
    const [reasonForAdoption, setReasonForAdoption] = useState('')

    // Form states - Care, Commitment & Legal
    const [experience, setExperience] = useState('')
    const [vetInfo, setVetInfo] = useState('')
    const [financialConfirmation, setFinancialConfirmation] = useState(false)
    const [spayNeuterAgreement, setSpayNeuterAgreement] = useState(false)
    const [trainingCommitment, setTrainingCommitment] = useState(false)
    const [policyAcknowledgment, setPolicyAcknowledgment] = useState(false)
    const [homeVisitConsent, setHomeVisitConsent] = useState(false)
    const [digitalSignature, setDigitalSignature] = useState('')

    // Form states - Deposit Payment
    const [paymentMethod, setPaymentMethod] = useState('zelle')
    const [additionalNotes, setAdditionalNotes] = useState('')

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function fetchPuppy() {
            const { data } = await supabase.from('puppies').select('*').eq('id', id).single()
            if (data) {
                setPuppy(data)
                setBreedPreference(data.breed || 'Bichon Frise')
            }
            setLoading(false)
        }
        fetchPuppy()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!policyAcknowledgment || !financialConfirmation || !spayNeuterAgreement || !trainingCommitment) {
            alert("Please acknowledge all required agreements.")
            return
        }

        setSubmitting(true)

        // Check auth
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            alert("Please log in to submit an adoption request.")
            router.push('/login')
            return
        }

        try {
            const { error } = await supabase.from('adoption_requests').insert({
                user_id: session.user.id,
                puppy_id: id,
                status: 'pending',
                application_details: {
                    applicantInfo: { firstName, lastName, email, phone, contactMethod, address },
                    household: { residenceType, rentOrOwn, householdMembers, otherPets, yardDescription },
                    employment: { occupation, workHours, daytimeCare },
                    preferences: { breedPreference, agePreference, genderPreference, reasonForAdoption },
                    careAndLegal: { experience, vetInfo, financialConfirmation, spayNeuterAgreement, trainingCommitment, policyAcknowledgment, homeVisitConsent, digitalSignature },
                    payment: { paymentMethod, additionalNotes }
                }
            })

            if (error) throw error

            // Notify admin
            fetch('/api/notify-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'adoption',
                    data: {
                        puppyName: puppy.name,
                        firstName,
                        lastName,
                        email,
                        phone
                    }
                })
            }).catch(e => console.error("Notification failed:", e))

            setSuccess(true)
        } catch (err: any) {
            alert("Error submitting request: " + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="min-h-screen text-center pt-32 text-gray-500">Loading application...</div>
    if (!puppy) return <div className="min-h-screen text-center pt-32 text-gray-500">Puppy not found.</div>

    if (success) {
        return (
            <main className="min-h-screen w-full flex flex-col bg-[#e6e2f0]">
                <div className="bg-primary-900"><Navbar /></div>
                <div className="flex-grow flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full text-center shadow-xl">
                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-4xl font-serif text-primary-950 mb-4">Application Received!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Thank you for applying to adopt {puppy.name}. We will review your application and get back to you shortly. You can check the status on your dashboard or message us.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-primary-700 hover:bg-primary-600 text-white rounded-full py-3 px-8 font-medium transition-colors"
                        >
                            View My Dashboard
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen w-full flex flex-col bg-[#fdfbf7]">
            <div className="bg-primary-900"><Navbar /></div>

            <div className="max-w-5xl mx-auto px-6 py-12 w-full">
                <div className="mb-10 text-center">
                    <FileText className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-serif text-primary-950">Adoption Application</h1>
                    <p className="text-primary-800/80 mt-2">You are applying to adopt {puppy.name}</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row border border-gray-100">
                    {/* Summary Sidebar */}
                    <div className="md:w-1/4 bg-primary-50 p-8 border-r border-gray-100 hidden md:flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-sm border-4 border-white">
                            <Image
                                src={puppy.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80'}
                                alt={puppy.name}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <h3 className="text-2xl font-serif text-primary-900">{puppy.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">{puppy.breed}</p>
                        <div className="w-full h-px bg-primary-200/50 my-6"></div>
                        <div className="w-full space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Adoption Fee</span>
                                <span className="font-medium text-primary-900">${puppy.adoption_fee}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Deposit</span>
                                <span className="font-medium text-primary-900">$500</span>
                            </div>
                        </div>
                        <div className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                            Crescent Moon Sanctuary Standards
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="md:w-3/4 p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-12">

                            {/* 1. Applicant Information */}
                            <section>
                                <h3 className="text-xl font-serif text-primary-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">1</span>
                                    Applicant Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                                        <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                                        <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferred Contact</label>
                                        <select value={contactMethod} onChange={e => setContactMethod(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50">
                                            <option value="email">Email</option>
                                            <option value="phone">Phone Call</option>
                                            <option value="text">Text Message</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Mailing Address</label>
                                        <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)}
                                            placeholder="Street, City, State, ZIP"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Household & Lifestyle */}
                            <section>
                                <h3 className="text-xl font-serif text-primary-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">2</span>
                                    Household & Lifestyle
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Residence Type</label>
                                        <select value={residenceType} onChange={e => setResidenceType(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50">
                                            <option value="house">House</option>
                                            <option value="apartment">Apartment</option>
                                            <option value="farm">Farm</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rent or Own?</label>
                                        <select value={rentOrOwn} onChange={e => setRentOrOwn(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50">
                                            <option value="own">I Own my home</option>
                                            <option value="rent">I Rent (Landlord permission required)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Household Members</label>
                                        <textarea required rows={2} value={householdMembers} onChange={e => setHouseholdMembers(e.target.value)}
                                            placeholder="List all adults, children, and their ages"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Other Pets</label>
                                        <textarea rows={2} value={otherPets} onChange={e => setOtherPets(e.target.value)}
                                            placeholder="Species, breed, age, and vaccination status of current pets"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Yard / Fencing</label>
                                        <textarea required rows={2} value={yardDescription} onChange={e => setYardDescription(e.target.value)}
                                            placeholder="Description of your yard and any security/fencing available"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Employment & Availability */}
                            <section>
                                <h3 className="text-xl font-serif text-primary-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">3</span>
                                    Employment & Availability
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Occupation</label>
                                        <input type="text" required value={occupation} onChange={e => setOccupation(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Work Schedule</label>
                                        <input type="text" required value={workHours} onChange={e => setWorkHours(e.target.value)}
                                            placeholder="e.g. 9am-5pm Mon-Fri"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daytime Puppy Care</label>
                                        <textarea required rows={2} value={daytimeCare} onChange={e => setDaytimeCare(e.target.value)}
                                            placeholder="Who will look after the puppy during the day?"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Puppy Preferences */}
                            <section>
                                <h3 className="text-xl font-serif text-primary-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">4</span>
                                    Puppy Preferences
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Breed / Size Preference</label>
                                        <input type="text" value={breedPreference} onChange={e => setBreedPreference(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Age Preference</label>
                                        <select value={agePreference} onChange={e => setAgePreference(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50">
                                            <option value="puppy">Puppy</option>
                                            <option value="young">Young</option>
                                            <option value="adult">Adult</option>
                                            <option value="no-preference">No Preference</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gender Preference</label>
                                        <select value={genderPreference} onChange={e => setGenderPreference(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="no-preference">No Preference</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reason for Adoption</label>
                                        <textarea required rows={2} value={reasonForAdoption} onChange={e => setReasonForAdoption(e.target.value)}
                                            placeholder="Companionship, family pet, emotional support, etc."
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* 5. Care, Commitment & Legal */}
                            <section className="bg-primary-50/50 -mx-8 md:-mx-12 p-8 md:p-12 border-y border-primary-100">
                                <h3 className="text-xl font-serif text-primary-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">5</span>
                                    Care, Commitment & Legal
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pet Ownership Experience</label>
                                        <textarea required rows={3} value={experience} onChange={e => setExperience(e.target.value)}
                                            placeholder="Previous experience with dogs or training"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-white shadow-sm"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Veterinarian Information</label>
                                        <textarea required rows={2} value={vetInfo} onChange={e => setVetInfo(e.target.value)}
                                            placeholder="Current vet or plans for finding one"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-white shadow-sm"></textarea>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" required checked={financialConfirmation} onChange={e => setFinancialConfirmation(e.target.checked)}
                                                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-primary-900 transition-colors">
                                                I confirm I am financially able to cover health, food, and grooming costs for this puppy.
                                            </span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" required checked={spayNeuterAgreement} onChange={e => setSpayNeuterAgreement(e.target.checked)}
                                                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-primary-900 transition-colors">
                                                I commitment to the spay/neuter procedure at the proper age recommended by a veterinarian.
                                            </span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" required checked={trainingCommitment} onChange={e => setTrainingCommitment(e.target.checked)}
                                                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-primary-900 transition-colors">
                                                I agree to properly socialize and train the puppy.
                                            </span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" required checked={policyAcknowledgment} onChange={e => setPolicyAcknowledgment(e.target.checked)}
                                                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-primary-900 transition-colors font-medium">
                                                I agree to the sanctuary’s specific rescue and adoption policies as outlined.
                                            </span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" checked={homeVisitConsent} onChange={e => setHomeVisitConsent(e.target.checked)}
                                                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-primary-900 transition-colors text-xs">
                                                Optional: I consent to a potential home visit or reference check if required.
                                            </span>
                                        </label>
                                    </div>

                                    <div className="pt-6">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Digital Signature</label>
                                        <input type="text" required value={digitalSignature} onChange={e => setDigitalSignature(e.target.value)}
                                            placeholder="Type your full legal name to finalize"
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-4 border bg-white shadow-inner font-serif italic text-lg" />
                                    </div>
                                </div>
                            </section>

                            {/* 6. Deposit Payment */}
                            <section>
                                <h3 className="text-xl font-serif text-primary-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">6</span>
                                    Deposit Payment
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Method</label>
                                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50">
                                            <option value="zelle">Zelle</option>
                                            <option value="chime">Chime</option>
                                            <option value="apple-pay">Apple Pay</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="cashapp">CashApp</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Notes (Optional)</label>
                                        <textarea rows={2} value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)}
                                            className="w-full border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 p-3 border bg-gray-50/50"></textarea>
                                    </div>
                                </div>
                            </section>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-full shadow-xl text-xl font-medium text-white bg-primary-700 hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed scale-100 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {submitting ? 'Submitting Application...' : 'Submit Application & Pay Deposit'}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4 px-12 italic">
                                    By clicking submit, you agree that all information provided is true and accurate to the best of your knowledge.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
