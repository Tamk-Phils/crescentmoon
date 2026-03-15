import { Navbar } from '@/components/layout/navbar'

export default function TermsPage() {
    return (
        <main className="min-h-screen w-full bg-[#fdfbf7]">
            <div className="bg-primary-950 pb-16 pt-6 rounded-b-[3rem] shadow-xl">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-12 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4">Terms of Service</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 space-y-10">
                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">1. Acceptance of Terms</h2>
                    <p className="leading-relaxed">By accessing the Crescent Moon Cocker Spaniels website and using our services, you agree to be bound by these Terms of Service. These terms apply to all visitors, users, and others who access or use our services.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">2. Adoption Application Process</h2>
                    <p className="leading-relaxed">Submission of an adoption application does not guarantee the approval or reservation of a puppy. We reserve the right to refuse an application for any reason to ensure our puppies are placed in the best possible homes.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">3. Deposits and Payments</h2>
                    <div className="space-y-4">
                        <p className="leading-relaxed">To join our waitlist or reserve an available puppy, a deposit of $500 is required. Our current policy is as follows:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Refundability:</strong> The $500 deposit is <strong>fully refundable</strong> at any time before the final sale agreement is signed.</li>
                            <li><strong>Final Payment:</strong> The remaining balance for your puppy must be paid in full by the time of pickup or scheduled delivery.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">4. Breeding & Ownership Terms</h2>
                    <p className="leading-relaxed">All puppies are sold on a strict <strong>spay/neuter contract</strong> as pet companions only, unless breeding rights are explicitly granted in writing by Crescent Moon Cocker Spaniels. We maintain the right to verify the health and living conditions of our puppies post-adoption.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">5. User Conduct</h2>
                    <p className="leading-relaxed">You agree not to use our website for any unlawful purposes or to transmit any material that is harmful, offensive, or violates the rights of others. You are responsible for maintaining the confidentiality of your account credentials.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">6. Intellectual Property</h2>
                    <p className="leading-relaxed font-semibold">All content on this website, including but not limited to:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-2">
                        <li>Breed photographs and puppy images.</li>
                        <li>Logos, branding, and text descriptions.</li>
                        <li>Educational content and training guides.</li>
                    </ul>
                    <p className="mt-4 leading-relaxed">is the property of Crescent Moon Cocker Spaniels and is protected by copyright laws. Unauthorized use or reproduction is strictly prohibited.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">7. Limitation of Liability</h2>
                    <p className="leading-relaxed">Crescent Moon Cocker Spaniels shall not be liable for any indirect, incidental, or consequential damages resulting from your use of this website or the purchase of a puppy beyond the terms specifically outlined in our health guarantee contract.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">8. Governing Law</h2>
                    <p className="leading-relaxed">These terms shall be governed by and construed in accordance with the laws of the state in which our breeding program is based, without regard to its conflict of law provisions.</p>
                </section>

                <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
                    <h2 className="text-3xl font-serif mb-4 text-primary-900">Questions?</h2>
                    <p className="leading-relaxed">If you have any questions about these Terms of Service, please contact us:</p>
                    <p className="mt-4 font-medium">Email: support@crescentmooncocker.com</p>
                </section>
            </div>
        </main>
    )
}
