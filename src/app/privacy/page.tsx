import { Navbar } from '@/components/layout/navbar'

export default function PrivacyPage() {
    return (
        <main className="min-h-screen w-full bg-[#fdfbf7]">
            <div className="bg-primary-950 pb-16 pt-6 rounded-b-[3rem] shadow-xl">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-12 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4">Privacy Policy</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 space-y-10">
                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">1. Introduction</h2>
                    <p className="leading-relaxed">Crescent Moon Cocker Spaniels ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services, including our adoption application process.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">2. Information We Collect</h2>
                    <div className="space-y-4">
                        <p className="font-semibold">Personal Information:</p>
                        <p className="leading-relaxed">We collect information you provide directly to us when you:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Submit an adoption application (Name, Email, Phone, Address, Household details).</li>
                            <li>Create an account or sign up for our services.</li>
                            <li>Contact us via email or our contact form.</li>
                            <li>Make a deposit or payment for a puppy.</li>
                        </ul>
                        <p className="font-semibold mt-4">Automatically Collected Information:</p>
                        <p className="leading-relaxed">When you visit our site, we automatically collect certain information about your device, including your IP address, browser type, and how you interact with our pages via cookies and similar technologies.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">3. How We Use Your Information</h2>
                    <p className="leading-relaxed mb-4">We use your information for several purposes, including:</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Processing and evaluating adoption applications.</li>
                        <li>Communicating with you about available puppies and waitlists.</li>
                        <li>Managing your account and providing customer support.</li>
                        <li>Improving our website and user experience.</li>
                        <li>Complying with legal obligations.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">4. Data Sharing and Disclosure</h2>
                    <p className="leading-relaxed">We do not sell your personal information. We may share your data with:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-2">
                        <li><strong>Service Providers:</strong> Third-party vendors who help us operate our website (e.g., Supabase for database management, email services).</li>
                        <li><strong>Legal Requirements:</strong> If required by law, court order, or to protect our rights and property.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">5. Data Security</h2>
                    <p className="leading-relaxed">We implement industry-standard security measures, including SSL encryption and secure database management through Supabase, to protect your personal data. However, please be aware that no transmission over the internet is 100% secure.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">6. Your Privacy Rights</h2>
                    <p className="leading-relaxed">Depending on your location, you may have the right to access, update, or delete your personal information. To exercise these rights, please log into your account or contact us directly.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">7. Children's Privacy</h2>
                    <p className="leading-relaxed">Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
                </section>

                <section>
                    <h2 className="text-3xl font-serif mb-6 text-primary-900 border-b pb-2">8. Changes to This Policy</h2>
                    <p className="leading-relaxed">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date."</p>
                </section>

                <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
                    <h2 className="text-3xl font-serif mb-4 text-primary-900">Contact Us</h2>
                    <p className="leading-relaxed">If you have any questions or concerns about our Privacy Policy, please reach out to us:</p>
                    <p className="mt-4 font-medium">Email: hello@crescentmoonspaniels.com</p>
                    <p>Phone: (555) 123-4567</p>
                </section>
            </div>
        </main>
    )
}
