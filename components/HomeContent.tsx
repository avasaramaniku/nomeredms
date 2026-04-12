'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from './Header';
import CategoryBar from './CategoryBar';
import ResourceCard from './ResourceCard';
import LinkGateModal from './LinkGateModal';
import MobileNav from './MobileNav';
import ResourceCardSkeleton from './ui/ResourceCardSkeleton';
import CreatorCard from './CreatorCard';
import GlassLoading from './ui/GlassLoading';
import dynamic from 'next/dynamic';

const AnoAI = dynamic(() => import('./ui/animated-shader-background'), { ssr: false });
const MobileSearchOverlay = dynamic(() => import('./MobileSearchOverlay'), { ssr: false });
import { mapCreator, mapResource } from '@/lib/mappers';
import { useRealtime } from '@/lib/hooks/useRealtime';


import { Zap, ChevronDown, Sparkles, ArrowRight, Users } from 'lucide-react';
import { Resource, Creator, TrendingPrompt } from '@/types';

type SortOrder = 'newest' | 'oldest' | 'title-az' | 'title-za' | 'category';

interface HomeContentProps {
    initialCreators: Creator[];
    initialResources: Resource[];
    launchedByParams?: boolean;
}

export default function HomeContent({
    initialCreators,
    initialResources,
    launchedByParams = false
}: HomeContentProps) {
    const router = useRouter();

    // State
    // Resources and Creators are now managed by the Real-time Pipeline
    // State is moved into useRealtime hooks below


    // Simplified launch state
    const [hasLaunched, setHasLaunched] = useState(launchedByParams);

    // If param changes (e.g. navigation), update state
    useEffect(() => {
        if (launchedByParams) {
            setHasLaunched(true);
            setTimeout(() => {
                document.getElementById('app-interface')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [launchedByParams]);

    // Real-time Pipeline for Resources
    const [resources, setResources] = useRealtime<Resource>(
        'resources',
        initialResources,
        mapResource,
        {
            shouldUpdate: (r) => r.status === 'live' && !r.isHidden,
            onEvent: (payload) => {
                // Feature: Auto-clear mocks when real data arrives
                if (payload.eventType === 'INSERT') {
                    setResources(prev => {
                        const isShowingMocks = prev.some(r => typeof r.id === 'string' && r.id.startsWith('p'));
                        return isShowingMocks ? prev.filter(r => !r.id.toString().startsWith('p')) : prev;
                    });
                }
            }
        }
    );

    // Real-time Pipeline for Creators
    const [creators, setCreators] = useRealtime<Creator>(
        'creators',
        initialCreators,
        mapCreator,
        {
            shouldUpdate: (c) => !c.isHidden,
            onEvent: (payload) => {
                // Feature: Auto-clear mocks when real data arrives
                if (payload.eventType === 'INSERT') {
                    setCreators(prev => {
                        const isShowingMocks = prev.some(c => typeof c.id === 'string' && c.id.startsWith('c'));
                        return isShowingMocks ? prev.filter(c => !c.id.toString().startsWith('c')) : prev;
                    });
                }
            }
        }
    );


    const [viewMode, setViewMode] = useState<'resources' | 'creators'>('resources');
    const [selectedCreatorSlug, setSelectedCreatorSlug] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'report' | 'trending'>('report');

    // Theme state (local for now, ideally context)
    const [isDarkMode, setIsDarkMode] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Dark Mode Effect
    useEffect(() => {
        const saved = localStorage.getItem('nmd_theme');
        const initialMode = saved ? saved === 'dark' : true;
        setIsDarkMode(initialMode);
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
            localStorage.setItem('nmd_theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('nmd_theme', 'light');
        }
    }, [isDarkMode]);

    const bgOpacity = useTransform(scrollYProgress, [0, 0.4, 0.45], [1, 1, 0]);
    const mainBgColor = useTransform(scrollYProgress, [0.45, 0.5, 0.8], ["#09090b", "#ffffff", "#ffffff"]);
    const mainTextColor = useTransform(scrollYProgress, [0.45, 0.5, 0.8], ["#ffffff", "#09090b", "#09090b"]);

    const filteredResources = useMemo(() => {
        let list = [...resources].filter(r => !r.isHidden && r.status === 'live');

        if (selectedCategory !== 'All') list = list.filter(r => r.category === selectedCategory);
        if (selectedTag) list = list.filter(r => r.tags.includes(selectedTag));

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(r =>
                (r.title || '').toLowerCase().includes(lower) ||
                (r.tags || []).some(t => t.toLowerCase().includes(lower)) ||
                creators.find(c => c.id === r.creatorId)?.displayName?.toLowerCase().includes(lower)
            );
        }

        list.sort((a, b) => {
            switch (sortOrder) {
                case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'title-az': return a.title.localeCompare(b.title);
                case 'title-za': return b.title.localeCompare(a.title);
                case 'category': return a.category.localeCompare(b.category);
                default: return 0;
            }
        });

        return list;
    }, [resources, selectedCategory, selectedTag, searchTerm, creators, sortOrder]);

    const handleLaunch = () => {
        setHasLaunched(true);
        setTimeout(() => {
            const el = document.getElementById('app-interface');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleNavigateCreator = (slug: string) => {
        router.push(`/creator/${slug}`);
    };

    const handleShowModal = (mode: 'report' | 'trending' = 'report') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    // Duplicated creators for marquee
    const duplicatedCreators = useMemo(() => {
        const visibleCreators = creators.filter(c => !c.isHidden);
        return [...visibleCreators, ...visibleCreators, ...visibleCreators];
    }, [creators]);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white font-sans tracking-tight" ref={containerRef}>

            {isDarkMode && (
                <motion.div style={{ opacity: bgOpacity }} className="fixed inset-0 z-0" aria-hidden="true">
                    <AnoAI />
                </motion.div>
            )}

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header
                    currentSearchTerm={searchTerm}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        if (!hasLaunched) {
                            handleLaunch();
                        } else {
                            // Only scroll if we are very far from the interface or if the term just became non-empty
                            const interfaceEl = document.getElementById('app-interface');
                            if (interfaceEl) {
                                const rect = interfaceEl.getBoundingClientRect();
                                if (rect.top > window.innerHeight || rect.bottom < 0) {
                                    interfaceEl.scrollIntoView({ behavior: 'smooth' });
                                }
                            }
                        }
                    }}
                    onNavigateHome={() => {
                        setHasLaunched(false);
                        setSearchTerm('');
                        router.push('/');
                    }}
                    onNavigateTrending={() => router.push('/trending')}
                    onNavigateFeed={() => {
                        setHasLaunched(true);
                        setTimeout(() => {
                            document.getElementById('app-interface')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                />

                <main id="main-content" className="flex-1 pb-24 md:pb-0 outline-none">
                    {!hasLaunched ? (
                        <div className="flex flex-col">
                            <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10 lg:mb-12 flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 backdrop-blur-md text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 dark:text-white/60 shadow-sm"
                                >
                                    <Sparkles className="h-3.5 w-3.5 text-green-500" />
                                    The DM Era is Over
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                                    className="max-w-[90rem] mx-auto text-6xl sm:text-8xl lg:text-[11rem] font-black leading-[0.9] lg:leading-[0.85] tracking-tighter text-zinc-900 dark:text-white"
                                >
                                    STOP BEGGING <br />
                                    <span className="text-zinc-300 dark:text-zinc-800">FOR LINKS.</span>
                                </motion.h1>

                                <motion.p className="mt-12 max-w-xl text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm">
                                    "Check your DMs" is a conversion killer. <br className="hidden sm:block" /> Stop waiting. Start building.
                                </motion.p>

                                <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-12">
                                    <ChevronDown className="h-8 w-8 text-zinc-300 dark:text-zinc-800" />
                                </motion.div>
                            </section>

                            <section className="py-40 overflow-hidden bg-white dark:bg-zinc-950">
                                <div className="mx-auto w-full">
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 text-center mb-16 px-6 italic">Instant Access to the 1%</h3>
                                    <div className="relative flex overflow-x-hidden">
                                        <div className="flex gap-12 animate-marquee whitespace-nowrap py-10">
                                            {duplicatedCreators.map((c, i) => (
                                                <motion.div
                                                    key={`${c.id}-${i}`}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    onClick={() => handleNavigateCreator(c.slug)}
                                                    className="flex-shrink-0 flex items-center gap-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 px-10 py-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-neutral-800 transition-all cursor-pointer group"
                                                >
                                                    {c.profilePic ? (
                                                        <img src={c.profilePic} className="h-14 w-14 rounded-full grayscale group-hover:grayscale-0 transition-all border border-transparent group-hover:border-white/20 object-cover" alt="" />
                                                    ) : (
                                                        <div className="h-14 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-white/10">
                                                            <Users className="h-6 w-6 text-zinc-400" />
                                                        </div>
                                                    )}
                                                    <span className="text-zinc-950 dark:text-white font-black uppercase tracking-tighter text-2xl group-hover:tracking-tight transition-all">{c.displayName}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <motion.section
                                style={{ backgroundColor: isDarkMode ? mainBgColor : '#ffffff' }}
                                className="h-screen relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
                            >
                                <motion.div style={{ color: isDarkMode ? mainTextColor : '#09090b' }} className="text-center space-y-8 z-10">
                                    <div className="flex justify-center">
                                        <div className="p-6 rounded-3xl bg-zinc-950 text-white shadow-2xl">
                                            <Zap className="h-16 w-16 fill-current" />
                                        </div>
                                    </div>
                                    <h2 className="text-5xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic">NO MORE DMs.</h2>
                                    <p className="max-w-2xl mx-auto text-lg sm:text-2xl font-bold opacity-50 px-6">Every tool, kit, and template. One URL.</p>
                                    <motion.button onClick={handleLaunch} className="mt-12 group relative inline-flex items-center gap-4 bg-zinc-950 text-white px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest shadow-2xl transition-all">
                                        Browse Resources <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </motion.div>
                            </motion.section>
                        </div>
                    ) : (
                        <div id="app-interface" className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">

                                {/* Toggle Header */}
                                <div className="flex flex-col items-center mb-12 space-y-6">
                                    <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-white/5">
                                        <button
                                            onClick={() => setViewMode('resources')}
                                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'resources'
                                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                                                }`}
                                        >
                                            Resource Hub
                                        </button>
                                        <button
                                            onClick={() => setViewMode('creators')}
                                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'creators'
                                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                                                }`}
                                        >
                                            Creator Hub
                                        </button>
                                    </div>
                                </div>

                                {viewMode === 'resources' ? (
                                    <>
                                        <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                                        <div className="mt-12 mb-8 flex items-center justify-between">
                                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Latest Drops</h2>
                                            <div className="h-px flex-1 mx-8 bg-zinc-100 dark:bg-zinc-800/50" />
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Feed</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pb-24">
                                            {filteredResources.map((resource) => (
                                                <ResourceCard
                                                    key={resource.id}
                                                    resource={resource}
                                                    creator={creators.find(c => c.id === resource.creatorId)}
                                                    onNavigateCreator={handleNavigateCreator}
                                                />
                                            ))}
                                            {filteredResources.length === 0 && (
                                                <div className="col-span-full py-20 text-center">
                                                    <p className="text-zinc-500 font-bold uppercase tracking-widest">No resources found matching your search.</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-4 mb-8 flex items-center justify-between">
                                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Verified Creators</h2>
                                            <div className="h-px flex-1 mx-8 bg-zinc-100 dark:bg-zinc-800/50" />
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{creators.length} Active</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-24">
                                            {creators
                                                .filter(c => {
                                                    if (c.isHidden) return false;
                                                    if (!searchTerm) return true;
                                                    const lower = searchTerm.toLowerCase();
                                                    return (
                                                        (c.displayName || '').toLowerCase().includes(lower) ||
                                                        (c.username || '').toLowerCase().includes(lower) ||
                                                        (c.bio || '').toLowerCase().includes(lower) ||
                                                        (c.niche || '').toLowerCase().includes(lower)
                                                    );
                                                })
                                                .map((creator) => (
                                                    <CreatorCard
                                                        key={creator.id}
                                                        creator={creator}
                                                        onNavigate={handleNavigateCreator}
                                                    />
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Q&A / How It Works Section */}
                            <section className="py-32 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-white/5">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                    <div className="flex flex-col lg:flex-row gap-20">
                                        <div className="lg:w-1/3">
                                            <div className="sticky top-32">
                                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-8 w-fit shadow-sm">
                                                    How it Works
                                                </div>
                                                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.85]">
                                                    FREQUENTLY <br />
                                                    <span className="text-zinc-300 dark:text-zinc-800">ASKED.</span>
                                                </h2>
                                                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Everything you need to know about the new era of creator distribution.</p>
                                            </div>
                                        </div>

                                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                                            {[
                                                {
                                                    q: "What exactly is NOMOREDMS?",
                                                    a: "A streamlined distribution hub for top-tier creators. Instead of manually replying to 'Link?' DMs, you provide a single, professional source for your audience to find everything instantly."
                                                },
                                                {
                                                    q: "How do creators get verified?",
                                                    a: "Verification is earned through consistency, original work, and maintaining high 'Resource Health' scores. We prioritize quality over quantity."
                                                },
                                                {
                                                    q: "Is it really free for everyone?",
                                                    a: "Yes. NOMOREDMS is built to empower creators. Whether you share 5 kits or 500, our core hub remains accessible for all approved creators."
                                                },
                                                {
                                                    q: "What is a 'Link Gate'?",
                                                    a: "A strategic tool. You can require users to 'Follow' or 'Join' a list before accessing a resource, turning a simple download into a long-term fan connection."
                                                },
                                                {
                                                    q: "How do I claim my own hub?",
                                                    a: "Click 'Join as Creator' in the header. Once approved, you'll get a professional /creator/slug that acts as your centralized resource portfolio."
                                                },
                                                {
                                                    q: "Is my data secure?",
                                                    a: "We use enterprise-grade Supabase encryption and row-level security. Your assets and your audience's trust are our highest priorities."
                                                }
                                            ].map((item, idx) => (
                                                <div key={idx} className="group border-b border-zinc-100 dark:border-white/5 pb-12 last:border-0">
                                                    <h3 className="text-lg font-black uppercase tracking-tighter mb-4 group-hover:text-green-500 transition-colors">
                                                        {item.q}
                                                    </h3>
                                                    <p className="text-zinc-500 font-medium leading-relaxed dark:text-zinc-400">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </main>

                <footer className="hidden md:block border-t border-zinc-100 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl py-24 text-center">
                    <Link href="/" className="mb-12 inline-flex items-center gap-3 group" onClick={() => { setHasLaunched(false); setSearchTerm(''); }}>
                        <Zap className="h-8 w-8 text-zinc-950 dark:text-white fill-current" />
                        <span className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">NOMOREDMS</span>
                    </Link>
                    
                    <div className="flex justify-center gap-12 mb-12 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        <Link href="/blog" className="hover:text-zinc-950 dark:hover:text-white transition-all">Blog</Link>
                        <Link href="/privacy-policy" className="hover:text-zinc-950 dark:hover:text-white transition-all">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-zinc-950 dark:hover:text-white transition-all">Terms of Service</Link>
                        <Link href="/creator-login" className="hover:text-zinc-950 dark:hover:text-white transition-all text-green-600">Creator Hub</Link>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">NOMOREDMS &copy; 2024</p>
                </footer>

                <MobileNav onOpenSearch={() => setIsMobileSearchOpen(true)} />
                <MobileSearchOverlay isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} onSearch={setSearchTerm} currentSearchTerm={searchTerm} />
                <LinkGateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} onLogin={() => { setIsModalOpen(false); }} />
            </div>
        </div>
    );
}
