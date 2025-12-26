import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Shield, Users, Store, Trash2, LogOut, Search, Lock, Mail, Key } from 'lucide-react';

const SuperAdminDashboard = () => {
    const { currentUser, login, signup, logout } = useAuth();
    const navigate = useNavigate();

    // Auth State
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState(''); // Protection for admin creation
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Dashboard State
    const [users, setUsers] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState(null); // 'admin', 'seller', 'user'

    const ADMIN_SECRET = "A2Z_Admin_2025"; // Secret code to create admin account
    const HARDCODED_ADMINS = ['sumanthgunda724@gmail.com'];

    useEffect(() => {
        if (!currentUser) return;

        const checkAccessAndLoad = async () => {
            setLoading(true);
            try {
                // Check Firestore Role
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userDocRef);

                let role = 'user';
                if (userSnap.exists()) {
                    role = userSnap.data().role;
                }

                // Grant access if hardcoded OR db role is admin
                if (HARDCODED_ADMINS.includes(currentUser.email) || role === 'admin') {
                    setUserRole('admin');
                    await fetchData();
                } else {
                    setUserRole(role); // Likely 'user' or 'seller' -> Access Denied
                }
            } catch (err) {
                console.error("Error verifying admin:", err);
                setAuthError("Failed to verify admin privileges.");
            } finally {
                setLoading(false);
            }
        };

        checkAccessAndLoad();

    }, [currentUser]);

    const fetchData = async () => {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            const businessSnap = await getDocs(collection(db, 'businesses'));
            setBusinesses(businessSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        try {
            if (isLoginMode) {
                await login(email, password);
                // useEffect will trigger and check access
            } else {
                // Register Mode
                if (secretCode !== ADMIN_SECRET) {
                    setAuthError("Invalid Admin Secret Code.");
                    setAuthLoading(false);
                    return;
                }

                const cred = await signup(email, password, "Super Admin");

                // Force Role to 'admin' in Firestore
                await setDoc(doc(db, 'users', cred.user.uid), {
                    email: email,
                    role: 'admin', // KEY STEP
                    createdAt: new Date().toISOString()
                }, { merge: true });

                // useEffect will handle the rest
            }
        } catch (err) {
            console.error(err);
            setAuthError(err.message || "Authentication failed");
        } finally {
            setAuthLoading(false);
        }
    };

    // --- Actions ---

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert("Failed to update role");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            alert("Failed delete");
        }
    };

    const handleStatusChange = async (bizId, status) => {
        try {
            await updateDoc(doc(db, 'businesses', bizId), { status });
            setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, status } : b));
        } catch (error) {
            alert("Failed update");
        }
    };

    const handleDeleteBusiness = async (bizId) => {
        if (!window.confirm("Delete this business?")) return;
        try {
            await deleteDoc(doc(db, 'businesses', bizId));
            setBusinesses(prev => prev.filter(b => b.id !== bizId));
        } catch (error) {
            alert("Failed delete");
        }
    };

    // --- Renders ---

    // 1. Not Logged In -> Show Auth Form
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
                    <div className="bg-indigo-600 p-6 text-center">
                        <Shield className="w-12 h-12 text-white mx-auto mb-2" />
                        <h2 className="text-2xl font-bold text-white">Super Admin Access</h2>
                        <p className="text-indigo-200 text-sm">Restricted Area</p>
                    </div>

                    <div className="p-8">
                        {authError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{authError}</div>}

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="admin@a2z.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {!isLoginMode && (
                                <div>
                                    <label className="block text-indigo-700 text-sm font-bold mb-1">Secret Code</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 w-4 h-4 text-indigo-500" />
                                        <input
                                            type="text"
                                            value={secretCode}
                                            onChange={e => setSecretCode(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50"
                                            placeholder="Enter Admin Secret"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Required to create a new admin account.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg mt-2"
                            >
                                {authLoading ? "Processing..." : (isLoginMode ? "Login to Dashboard" : "Create Admin Account")}
                            </button>
                        </form>

                        <div className="mt-6 text-center border-t border-gray-100 pt-4">
                            <p className="text-sm text-gray-600">
                                {isLoginMode ? "Need to create a new admin user?" : "Already have an account?"}
                            </p>
                            <button
                                onClick={() => setIsLoginMode(!isLoginMode)}
                                className="text-indigo-600 hover:text-indigo-800 font-bold text-sm mt-1"
                            >
                                {isLoginMode ? "Create New Admin Account" : "Back to Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Logged In but Checking Role
    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div></div>;

    // 3. Logged In but Access Denied
    if (userRole !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 font-sans text-center">
                <Shield className="w-20 h-20 text-red-500 mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6 max-w-md">
                    Logged in as: <strong>{currentUser.email}</strong><br />
                    Your current role is: <span className="uppercase font-bold text-red-600">{userRole || 'User'}</span>
                </p>
                <p className="text-sm text-gray-500 mb-8 max-w-sm">
                    Only users with the 'admin' role can access this dashboard.
                    If you just created this account, please ensure you used the correct Secret Code.
                </p>
                <button onClick={logout} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-black font-bold shadow-lg transition-transform hover:scale-105">
                    Logout
                </button>
            </div>
        );
    }

    // 4. Authorized -> Render Dashboard
    const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    // ... (Reuse the existing dashboard table JSX from previous step, but simplified for length constraint here)
    // I will insert the dashboard JSX here
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <nav className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-amber-400" />
                    <span className="text-xl font-bold tracking-wider">SUPER ADMIN PANEL</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-indigo-800 px-3 py-1 rounded text-sm">{currentUser.email}</span>
                    <button onClick={logout} className="p-2 hover:bg-red-600 rounded-lg transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <div><p className="text-gray-500 text-xs font-bold uppercase">Users</p><h3 className="text-3xl font-bold">{users.length}</h3></div>
                            <Users className="w-10 h-10 text-indigo-200" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <div><p className="text-gray-500 text-xs font-bold uppercase">Businesses</p><h3 className="text-3xl font-bold">{businesses.length}</h3></div>
                            <Store className="w-10 h-10 text-rose-200" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex gap-2">
                            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>Users</button>
                            <button onClick={() => setActiveTab('biz')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'biz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>Businesses</button>
                        </div>
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-4 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
                    </div>

                    <div className="overflow-x-auto">
                        {activeTab === 'users' ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-bold">
                                    <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Action</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{u.name || 'User'}</div>
                                                <div className="text-gray-500 text-xs">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select value={u.role || 'user'} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)} className={`text-xs font-bold px-2 py-1 rounded border ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 border-gray-200'}`}>
                                                    <option value="user">USER</option>
                                                    <option value="seller">SELLER</option>
                                                    <option value="admin">ADMIN</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right"><button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-bold">
                                    <tr><th className="px-6 py-4">Business</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {businesses.filter(b => b.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                                        <tr key={b.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{b.name}</div>
                                                <div className="text-gray-500 text-xs">{b.ownerEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status || 'pending'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                {b.status !== 'active' && <button onClick={() => handleStatusChange(b.id, 'active')} className="text-xs font-bold text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50">Approve</button>}
                                                <button onClick={() => handleDeleteBusiness(b.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
