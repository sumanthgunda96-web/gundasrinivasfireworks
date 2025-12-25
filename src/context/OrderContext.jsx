import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirestoreOrderService } from '../services/firebase/FirestoreOrderService';
import { useAuth } from './AuthContext';

const OrderContext = createContext();
const orderService = new FirestoreOrderService();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const { currentUser } = useAuth();
    // Admin check logic could be here or in the consuming component
    // For now we'll keep the basic "user orders" logic primarily, 
    // unless we need to expose the admin subscription here too.

    // We can expose the service directly or wrap methods. 
    // Wrapping methods is safer for state management.

    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            return;
        }

        // Subscribe to user's orders
        const unsubscribe = orderService.getUserOrders(currentUser.uid, (userOrders) => {
            setOrders(userOrders);
        });

        return unsubscribe;
    }, [currentUser]);

    const createOrder = async (orderData) => {
        try {
            const userId = currentUser ? currentUser.uid : null;
            return await orderService.createOrder(orderData, userId);
        } catch (error) {
            console.error("Error creating order: ", error);
            throw error;
        }
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId);
    };

    const getUserOrders = (userId) => {
        return orders.filter(order => order.userId === userId);
    };

    // Expose Admin method to components that might need it (like AdminOrders)
    // Or prefer creating a separate AdminContext. 
    // For simplicity given the scope, we can export the service instance or add an admin method here.
    const subscribeToAllOrders = (callback) => {
        return orderService.subscribeToOrders(callback);
    };

    const updateAdminOrderStatus = (orderId, status) => {
        return orderService.updateOrderStatus(orderId, status);
    };

    const value = {
        orders,
        createOrder,
        getOrderById,
        getUserOrders,
        subscribeToAllOrders,
        updateAdminOrderStatus
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
