import React from 'react';
import { Link } from 'react-router-dom';
import { Store, User, Sparkles } from 'lucide-react';

const PlatformHome = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white font-sans">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-bold text-white">A2Z</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">Commerce Cloud</span>
                </div>
                <div>
                    <Link to="/a2z/seller/login" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium">Seller Login</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                    Your Business.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400">On Any Cloud.</span>
                </h1>
                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                    The ultimate multi-tenant platform for managing your business online.
                    Create your store, manage inventory, and scale without limits.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
                    <Link to="/a2z/demo" className="group relative px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all">
                        <span className="flex items-center gap-2">
                            Visit Demo Store <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </span>
                    </Link>
                    <Link to="/a2z/seller/create-account" className="px-8 py-4 bg-transparent border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                        Create Business Account
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-colors">
                        <Store className="w-12 h-12 text-pink-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Multiple Businesses</h3>
                        <p className="text-gray-400">Manage distinct storefronts for all your different business ventures under one account.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-colors">
                        <User className="w-12 h-12 text-amber-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Unified Buyer Account</h3>
                        <p className="text-gray-400">Customers can shop across all your businesses with a single login and unified tracking.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-colors">
                        <Sparkles className="w-12 h-12 text-cyan-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Cloud Agnostic</h3>
                        <p className="text-gray-400">Built to migrate. Host on AWS, GCP, Azure or your own infrastructure with ease.</p>
                    </div>
                </div>
            </main>

            <footer className="text-center py-8 text-gray-500 text-sm">
                © 2024 A2Z Commerce. Powered by Antigravity.
            </footer>
        </div>
    );
};

export default PlatformHome;
