'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, FileText, Info, Home, Briefcase, Dog, ShieldCheck, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react'

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<any>(null)
    const supabase = createClient()

    const ADMIN_ID = '00000000-0000-0000-0000-000000000000'

    useEffect(() => {
        fetchRequests()
    }, [])

    async function fetchRequests() {
        const { data } = await supabase
            .from('adoption_requests')
            .select(`
        *,
        users ( full_name, email ),
        puppies ( name, breed )
      `)
            .order('created_at', { ascending: false })

        setRequests(data || [])
        setLoading(false)
    }

    async function updateStatus(id: string, status: string, puppyId: string, userId: string, puppyName: string) {
        if (!confirm(`Are you sure you want to mark this request as ${status}?`)) return

        // 1. Update request status
        const { error: updateError } = await supabase.from('adoption_requests').update({ status }).eq('id', id)
        if (updateError) {
            alert("Error updating status: " + updateError.message)
            return
        }

        // 2. If approved, update puppy status to adopted
        if (status === 'approved') {
            await supabase.from('puppies').update({ status: 'adopted' }).eq('id', puppyId)
        }

        // 3. Automated Notification via Chat
        try {
            // Find or create conversation
            let { data: conv } = await supabase
                .from('conversations')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle()

            if (!conv) {
                const { data: newConv } = await supabase
                    .from('conversations')
                    .insert({ user_id: userId, admin_id: ADMIN_ID })
                    .select('id')
                    .maybeSingle()
                conv = newConv
            }

            if (conv) {
                const message = status === 'approved'
                    ? `🐾 Congratulations! Your adoption request for ${puppyName} has been APPROVED. We are so excited to welcome you to the Crescent Moon family! We will reach out shortly with next steps regarding the deposit and pickup/shipping.`
                    : `Thank you for your interest in ${puppyName}. After careful review, we have decided not to proceed with your application at this time. We appreciate your understanding and wish you the best in your search for a furry companion.`;

                await supabase.from('messages').insert({
                    conversation_id: conv.id,
                    sender_id: ADMIN_ID,
                    content: message
                })
            }
        } catch (err) {
            console.error("Failed to send automated notification:", err)
        }

        fetchRequests()
        if (selectedRequest?.id === id) setSelectedRequest(null)
    }

    return (
        <div className="relative pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-primary-950">Adoption Requests</h1>
                <p className="text-gray-500 mt-1">Review and manage adoption applications.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
                        Loading requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                        No adoption requests found.
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:border-primary-200 transition-colors">

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-serif text-primary-900">{req.users?.full_name} <span className="text-sm font-sans text-gray-500 font-normal ml-2">({req.users?.email})</span></h3>
                                        <p className="text-primary-700 font-medium text-sm mt-1 flex items-center gap-1.5">
                                            <Dog className="w-4 h-4" /> Applying for: {req.puppies?.name} ({req.puppies?.breed})
                                        </p>
                                    </div>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                                    <p className="flex items-center gap-2"><Home className="w-4 h-4 text-gray-400" /> <span className="font-medium">Home:</span> {req.application_details?.household?.residenceType} ({req.application_details?.household?.rentOrOwn})</p>
                                    <p className="flex items-center gap-2"><Dog className="w-4 h-4 text-gray-400" /> <span className="font-medium">Experience:</span> {req.application_details?.careAndLegal?.experience ? 'Detailed' : 'Simple'}</p>
                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 mt-2 sm:mt-0"
                                    >
                                        <FileText className="w-4 h-4" /> View Full Application
                                    </button>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        Applied {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex md:flex-col justify-end gap-3 min-w-[140px]">
                                {req.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => updateStatus(req.id, 'approved', req.puppy_id, req.user_id, req.puppies?.name)}
                                            className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-colors text-sm font-medium shadow-sm"
                                        >
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(req.id, 'rejected', req.puppy_id, req.user_id, req.puppies?.name)}
                                            className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                                        >
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center md:text-right">
                                        <span className="text-xs text-gray-400 italic">Decision Made</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* Application Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary-50">
                            <div>
                                <h2 className="text-2xl font-serif text-primary-950">Application Details</h2>
                                <p className="text-sm text-primary-700">Submitted by {selectedRequest.users?.full_name} for {selectedRequest.puppies?.name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-gray-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8">

                            {/* Section 1: Applicant Info */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-primary-100 pb-2">
                                    <User className="w-5 h-5" />
                                    <h3 className="font-serif text-lg">Applicant Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                    <div><p className="text-gray-500 mb-1">Full Name</p> <p className="font-medium">{selectedRequest.application_details?.applicantInfo?.firstName} {selectedRequest.application_details?.applicantInfo?.lastName}</p></div>
                                    <div><p className="text-gray-500 mb-1">Email</p> <p className="font-medium flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedRequest.application_details?.applicantInfo?.email}</p></div>
                                    <div><p className="text-gray-500 mb-1">Phone</p> <p className="font-medium flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedRequest.application_details?.applicantInfo?.phone}</p></div>
                                    <div><p className="text-gray-500 mb-1">Contact Method</p> <p className="font-medium capitalize">{selectedRequest.application_details?.applicantInfo?.contactMethod}</p></div>
                                    <div className="md:col-span-2 lg:col-span-2"><p className="text-gray-500 mb-1">Address</p> <p className="font-medium flex items-start gap-1"><MapPin className="w-3 h-3 mt-1 shrink-0" /> {selectedRequest.application_details?.applicantInfo?.address}</p></div>
                                </div>
                            </section>

                            {/* Section 2: Household */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-primary-100 pb-2">
                                    <Home className="w-5 h-5" />
                                    <h3 className="font-serif text-lg">Household & Lifestyle</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                    <div><p className="text-gray-500 mb-1">Residence Type</p> <p className="font-medium capitalize">{selectedRequest.application_details?.household?.residenceType}</p></div>
                                    <div><p className="text-gray-500 mb-1">Home Ownership</p> <p className="font-medium capitalize">{selectedRequest.application_details?.household?.rentOrOwn}</p></div>
                                    <div className="md:col-span-2 lg:col-span-1"><p className="text-gray-500 mb-1">Household Members</p> <p className="font-medium">{selectedRequest.application_details?.household?.householdMembers}</p></div>
                                    <div className="md:col-span-2"><p className="text-gray-500 mb-1">Other Pets</p> <p className="font-medium">{selectedRequest.application_details?.household?.otherPets || 'None'}</p></div>
                                    <div className="md:col-span-2 lg:col-span-1"><p className="text-gray-500 mb-1">Yard / Fencing</p> <p className="font-medium">{selectedRequest.application_details?.household?.yardDescription}</p></div>
                                </div>
                            </section>

                            {/* Section 3: Employment */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-primary-100 pb-2">
                                    <Briefcase className="w-5 h-5" />
                                    <h3 className="font-serif text-lg">Employment & Care</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                    <div><p className="text-gray-500 mb-1">Occupation</p> <p className="font-medium">{selectedRequest.application_details?.employment?.occupation}</p></div>
                                    <div><p className="text-gray-500 mb-1">Work Schedule</p> <p className="font-medium">{selectedRequest.application_details?.employment?.workHours}</p></div>
                                    <div><p className="text-gray-500 mb-1">Daytime Care</p> <p className="font-medium">{selectedRequest.application_details?.employment?.daytimeCare}</p></div>
                                </div>
                            </section>

                            {/* Section 4: Preferences */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-primary-100 pb-2">
                                    <Dog className="w-5 h-5" />
                                    <h3 className="font-serif text-lg">Puppy Preferences</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm mb-4">
                                    <div><p className="text-gray-500 mb-1">Breed</p> <p className="font-medium">{selectedRequest.application_details?.preferences?.breedPreference}</p></div>
                                    <div><p className="text-gray-500 mb-1">Age</p> <p className="font-medium capitalize">{selectedRequest.application_details?.preferences?.agePreference}</p></div>
                                    <div><p className="text-gray-500 mb-1">Gender</p> <p className="font-medium capitalize">{selectedRequest.application_details?.preferences?.genderPreference}</p></div>
                                </div>
                                <div><p className="text-gray-500 text-sm mb-1">Reason for Adoption</p> <p className="text-sm font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{selectedRequest.application_details?.preferences?.reasonForAdoption}"</p></div>
                            </section>

                            {/* Section 5: Experience & Legal */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-primary-100 pb-2">
                                    <ShieldCheck className="w-5 h-5" />
                                    <h3 className="font-serif text-lg">Care & Commitment</h3>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><p className="text-gray-500 mb-1">Experience with Breed/Dogs</p> <p className="font-medium">{selectedRequest.application_details?.careAndLegal?.experience}</p></div>
                                        <div><p className="text-gray-500 mb-1">Veterinarian Information</p> <p className="font-medium">{selectedRequest.application_details?.careAndLegal?.vetInfo || 'Not provided'}</p></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {[
                                            { label: 'Financial Commitment', val: selectedRequest.application_details?.careAndLegal?.financialConfirmation },
                                            { label: 'Spay/Neuter Agreement', val: selectedRequest.application_details?.careAndLegal?.spayNeuterAgreement },
                                            { label: 'Training Commitment', val: selectedRequest.application_details?.careAndLegal?.trainingCommitment },
                                            { label: 'Policy Acknowledgment', val: selectedRequest.application_details?.careAndLegal?.policyAcknowledgment },
                                            { label: 'Home Visit Consent', val: selectedRequest.application_details?.careAndLegal?.homeVisitConsent }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                                                {item.val ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                                                <span className="text-xs font-medium text-gray-700">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Digital Signature</p>
                                        <p className="font-serif text-lg text-primary-900 italic underline decoration-primary-200">{selectedRequest.application_details?.careAndLegal?.digitalSignature}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Payment & Notes */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-primary-100 pb-2">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="font-serif text-lg">Deposit & Notes</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div><p className="text-gray-500 mb-1">Preferred Payment Method</p> <p className="font-medium uppercase tracking-wide">{selectedRequest.application_details?.payment?.paymentMethod}</p></div>
                                    <div><p className="text-gray-500 mb-1">Additional Notes</p> <p className="font-medium">{selectedRequest.application_details?.payment?.additionalNotes || 'No extra notes provided.'}</p></div>
                                </div>
                            </section>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Status: <span className="font-bold uppercase">{selectedRequest.status}</span>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(selectedRequest.id, 'rejected', selectedRequest.puppy_id, selectedRequest.user_id, selectedRequest.puppies?.name)}
                                            className="px-6 py-2 rounded-xl text-red-600 border border-red-200 hover:bg-red-50 font-medium transition-colors"
                                        >
                                            Reject Request
                                        </button>
                                        <button
                                            onClick={() => updateStatus(selectedRequest.id, 'approved', selectedRequest.puppy_id, selectedRequest.user_id, selectedRequest.puppies?.name)}
                                            className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-500 font-medium transition-colors shadow-lg"
                                        >
                                            Approve Request
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-6 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors sm:hidden w-full"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
