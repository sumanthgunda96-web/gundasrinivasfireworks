import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, CheckCircle, XCircle, Trash2, Search, Loader, BarChart, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';
import { FirestoreProductService } from '../services/firebase/FirestoreProductService';

const PlatformAdminDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [demoStoreMissing, setDemoStoreMissing] = useState(false);

    const businessService = new FirestoreBusinessService();
    const productService = new FirestoreProductService();
    const ADMIN_EMAILS = ['sumanthgunda724@gmail.com'];
    const DEMO_SLUG = 'demo';

    useEffect(() => {
        if (currentUser && !ADMIN_EMAILS.includes(currentUser.email)) {
            navigate('/');
            return;
        }
        fetchBusinesses();
    }, [currentUser]);

    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            const data = await businessService.getAllBusinesses();
            setBusinesses(data);

            // Check if demo store exists
            const hasDemo = data.some(b => b.slug === DEMO_SLUG);
            setDemoStoreMissing(!hasDemo);
        } catch (error) {
            console.error("Error fetching businesses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDemoStore = async () => {
        if (!window.confirm("This will initialize the 'demo' store in the database. Proceed?")) return;

        try {
            setLoading(true);
            // 1. Create Business Record
            const business = await businessService.createBusiness({
                name: 'A2Z Demo Store',
                slug: DEMO_SLUG,
                ownerId: 'admin_demo',
                ownerEmail: 'sumanthgunda724@gmail.com', // Link to Super Admin
                description: 'Official Platform Demo Store',
                status: 'active'
            });

            // 2. Seed Generic Products
            const demoProducts = [
                {
                    name: "Premium Wireless Headphones",
                    price: 299.99,
                    description: "High-fidelity audio with noise cancellation.",
                    category: "Electronics",
                    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                    stock: 50
                },
                {
                    name: "Ergonomic Office Chair",
                    price: 199.50,
                    description: "Comfortable mesh chair for long work hours.",
                    category: "Furniture",
                    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
                    stock: 25
                },
                {
                    name: "Smart Watch Series 5",
                    price: 399.00,
                    description: "Stay connected and track your fitness goals.",
                    category: "Wearables",
                    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                    stock: 100
                }
            ];

            for (const product of demoProducts) {
                await productService.addProduct(product, business.id);
            }

            await fetchBusinesses();
            alert("Demo store initialized successfully with generic products!");
        } catch (err) {
            console.error(err);
            alert("Failed to create demo store: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            await businessService.updateBusinessStatus(id, newStatus);
            setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL WARNING: This will permanently delete this business. Proceed?")) return;

        try {
            await businessService.deleteBusiness(id);
            setBusinesses(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error("Error deleting business:", error);
            alert("Failed to delete business");
        }
    };

    const filteredBusinesses = businesses.filter(b =>
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-indigo-900 text-white p-4 shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-amber-400" />
                        <div>
                            <h1 className="text-xl font-bold tracking-wide">A2Z SUPER ADMIN</h1>
                            <p className="text-xs text-indigo-300">Platform Management Console</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Demo Store Alert */}
                {demoStoreMissing && (
                    <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                            <div>
                                <h3 className="font-bold text-amber-800">Demo Store Missing</h3>
                                <p className="text-sm text-amber-700">The 'demo' store is not in the database.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateDemoStore}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> Initialize Demo Store
                        </button>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Vendors</h3>
                            <Building className="w-5 h-5 text-indigo-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{businesses.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Stores</h3>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {businesses.filter(b => b.status === 'active' || !b.status).length}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Building className="w-5 h-5" /> Registered Businesses
                        </h2>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                                    <th className="p-4">Business</th>
                                    <th className="p-4">Owner</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                                {filteredBusinesses.map((business) => (
                                    <tr key={business.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{business.name}</div>
                                            <div className="text-indigo-600 text-xs">/a2z/{business.slug}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-900">{business.ownerEmail || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${business.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-green-50 text-green-700 border-green-200'
                                                }`}>
                                                {business.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            {business.status !== 'rejected' ? (
                                                <button onClick={() => handleStatusChange(business.id, 'rejected')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg tooltip"><XCircle className="w-5 h-5" /></button>
                                            ) : (
                                                <button onClick={() => handleStatusChange(business.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip"><CheckCircle className="w-5 h-5" /></button>
                                            )}
                                            <div className="w-px bg-gray-200 mx-1"></div>
                                            <button onClick={() => handleDelete(business.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg tooltip"><Trash2 className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlatformAdminDashboard;
