import React, { useEffect, useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useBusiness } from '../../context/BusinessContext';

const AdminDashboard = () => {
    const { currentBusiness } = useBusiness();
    const { subscribeToAllOrders } = useOrders();
    const { products } = useProducts();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!currentBusiness) return;

        const unsubscribe = subscribeToAllOrders((allOrders) => {
            // Strict filtering: Only show orders for this business
            const businessOrders = allOrders.filter(o => o.businessId === currentBusiness.id);
            setOrders(businessOrders);
        });
        return unsubscribe;
    }, [currentBusiness]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Products Active</p>
                    <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <p className="text-gray-500">Feature coming soon...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
