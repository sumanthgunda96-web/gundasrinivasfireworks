import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, LogIn, ArrowRight, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';

const BusinessLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const businessService = new FirestoreBusinessService();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await login(email, password);
            const user = userCredential.user || userCredential;

            // Fetch business owned by this user
            const businesses = await businessService.getBusinessByOwner(user.uid);

            if (businesses && businesses.length > 0) {
                // Redirect to the first business admin
                navigate(`/a2z/${businesses[0].slug}/admin`);
            } else {
                // No business found - strict separation means we tell them.
                // We do NOT redirect to legacy or auto-create page.
                const wantsToCreate = window.confirm("No commercial store found linked to this account. Would you like to create a new business account?");
                if (wantsToCreate) {
                    navigate('/a2z/seller/create-account');
                } else {
                    setError("No business account found associated with this email.");
                    // Optional: logout to prevent stuck session
                }
            }
        } catch (err) {
            console.error("Login verify error:", err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Info */}
                <div className="hidden md:flex md:w-5/12 bg-indigo-600 p-8 flex-col justify-between text-white">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Store className="w-8 h-8" />
                            <span className="text-2xl font-bold">A2Z</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Seller Login</h2>
                        <p className="text-indigo-100">Log in to manage your store, orders, and products.</p>
                    </div>
                    <div className="text-sm text-indigo-200">
                        © 2024 A2Z Commerce
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Seller Login</h1>
                        <p className="text-gray-500 text-sm mt-1">Access your store dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                            <span className="mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-500 cursor-pointer">
                                <input type="checkbox" className="mr-2 rounded text-indigo-600 focus:ring-indigo-500" />
                                Remember me
                            </label>
                            <Link to="/a2z/forgot-password" className="text-indigo-600 font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have a store yet? <Link to="/a2z/seller/create-account" className="text-indigo-600 font-medium hover:underline">Create Business Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BusinessLogin;
