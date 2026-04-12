import React from 'react';
import Link from 'next/link';
import { Zap, Shield, ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white font-sans tracking-tight">
            <div className="border-b border-zinc-100 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Zap className="h-6 w-6 text-zinc-950 dark:text-white fill-current transition-transform group-hover:scale-110" />
                        <span className="text-xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase">NOMOREDMS</span>
                    </Link>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Legal Center</div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white mb-12 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-white/60 mb-8">
                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                        Safe & Secure
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                        Privacy <br />
                        <span className="text-zinc-300 dark:text-zinc-800">Policy.</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Updated: April 2024</p>
                </div>

                <div className="space-y-12 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">1. Information We Collect</h2>
                        <p>At NOMOREDMS, we respect your privacy. We collect minimal information required to provide you with the best experience. This includes your email address when you apply as a creator, and anonymized usage data to help us improve the platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">2. Cookies & Tracking</h2>
                        <p>We use essential cookies to keep you signed in and maintain your preferences. We do not use third-party tracking scripts for advertising purposes. Your data is your own.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">3. Data Sharing</h2>
                        <p>We never sell your data. Creator information is shared only as necessary to display your profile and resources to the community. We use Supabase as our secure database provider.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">4. Your Rights</h2>
                        <p>You have the right to access, modify, or delete your personal data at any time. Simply contact our support team or manage your settings through the Creator Portal.</p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-zinc-100 dark:border-white/5 py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/20">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">NOMOREDMS Legal &copy; 2024</p>
            </footer>
        </div>
    );
}
