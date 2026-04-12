'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogCardProps {
    post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/5"
        >
            <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
            
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                {post.thumbnailUrl ? (
                    <img 
                        src={post.thumbnailUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black">
                        <span className="text-zinc-500 font-black uppercase text-xl">NOMOREDMS</span>
                    </div>
                )}
                <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                        {post.category}
                    </span>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                </div>

                <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 text-zinc-900 dark:text-white group-hover:text-green-500 transition-colors">
                    {post.title}
                </h3>

                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-8">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">
                    Read Article <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;
