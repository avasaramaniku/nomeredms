import React from 'react';
import Link from 'next/link';
import { Zap, Gavel, ChevronLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
                        <Gavel className="h-3.5 w-3.5 text-amber-500" />
                        Terms of Engagement
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                        Terms of <br />
                        <span className="text-zinc-300 dark:text-zinc-800">Service.</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Updated: April 2024</p>
                </div>

                <div className="space-y-12 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using NOMOREDMS, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you must not access the platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">2. Creator Conduct</h2>
                        <p>Creators are responsible for the content they share. Resources must be legitimate, functional, and accurately described. Spam, malicious links, or misleading content will result in immediate account termination.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">3. Intellectual Property</h2>
                        <p>All resources shared belong to their respective creators. NOMOREDMS claims no ownership over the content you upload. However, by using the platform, you grant us the right to display your content to users.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-4">4. Platform Availability</h2>
                        <p>While we strive for 100% uptime, NOMOREDMS is provided "as is". We reserve the right to modify or discontinue the service at any time without notice.</p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-zinc-100 dark:border-white/5 py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/20">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">NOMOREDMS Legal &copy; 2024</p>
            </footer>
        </div>
    );
}
