import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';
import { Store, User, Mail, Lock, ArrowRight, Loader, CheckCircle } from 'lucide-react';

const CreateBusinessAccount = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [successMode, setSuccessMode] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        businessName: '',
        slug: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const businessService = new FirestoreBusinessService();

    // ... (handleChange and handleSlugChange remain same)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            if (name === 'businessName' && !prev.slugEdited) {
                updates.slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            }
            return updates;
        });
    };

    const handleSlugChange = (e) => {
        setFormData(prev => ({
            ...prev,
            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
            slugEdited: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Validation
            if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
            if (formData.password.length < 6) throw new Error("Password must be at least 6 characters");
            if (formData.slug.length < 3) throw new Error("Store URL must be at least 3 characters");

            // 2. Check slug
            const isTaken = await businessService.isSlugTaken(formData.slug);
            if (isTaken) throw new Error("This Store URL is already taken. Please choose another.");

            // 3. Create User
            const userCredential = await signup(formData.email, formData.password, formData.fullName);
            const user = userCredential.user || userCredential;

            // 4. Create Business (PENDING)
            await businessService.createBusiness({
                name: formData.businessName,
                slug: formData.slug,
                ownerId: user.uid,
                ownerEmail: user.email,
                themeColor: '#4f46e5',
                status: 'pending' // Enforce approval workflow
            });

            // 5. Show Success UI
            setSuccessMode(true);

        } catch (err) {
            console.error("Signup Error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("An account with this email already exists. Please login.");
            } else {
                setError(err.message || "Failed to create account");
            }
        } finally {
            setLoading(false);
        }
    };

    if (successMode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your store <span className="font-semibold text-indigo-600">/a2z/{formData.slug}</span> has been created.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-8">
                        <h3 className="font-bold text-amber-800 text-sm mb-1">⚠️ Approval Required</h3>
                        <p className="text-amber-700 text-sm">
                            For quality assurance, all new businesses must be approved by an administrator before they can go live. You will be notified via email once approved.
                        </p>
                    </div>
                    <Link to="/" className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Info (Optional, hidden on small screens) */}
                <div className="hidden md:flex md:w-5/12 bg-indigo-600 p-8 flex-col justify-between text-white">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Store className="w-8 h-8" />
                            <span className="text-2xl font-bold">A2Z</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Start your journey</h2>
                        <p className="text-indigo-100">Launch your professional online store in seconds. Manage everything from one place.</p>
                    </div>
                    <div className="text-sm text-indigo-200">
                        © 2024 A2Z Commerce
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Create Business Account</h1>
                        <p className="text-gray-500 text-sm mt-1">Set up your store and admin access</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                            <span className="mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Store Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Business Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. Srinivas Fireworks"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                                <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                    <span className="px-3 py-2.5 bg-gray-50 text-gray-500 border-r border-gray-300 text-sm flex items-center">
                                        a2z/
                                    </span>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleSlugChange}
                                        placeholder="your-store-url"
                                        className="flex-1 px-3 py-2.5 outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Owner Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Owner Login</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 mt-6"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Create Business Account <ArrowRight className="ml-2 w-5 h-5" /></>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/a2z/seller/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateBusinessAccount;
