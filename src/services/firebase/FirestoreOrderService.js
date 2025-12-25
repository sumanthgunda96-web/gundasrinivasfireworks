import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    onSnapshot,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IOrderService } from '../interfaces';

export class FirestoreOrderService extends IOrderService {
    async createOrder(orderData, userId) {
        const newOrder = {
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: userId || 'guest'
        };

        const docRef = await addDoc(collection(db, 'orders'), newOrder);
        return { id: docRef.id, ...newOrder };
    }

    async getOrderById(orderId) {
        // Not used heavily in current app, but good to have
        // Implementation omitted for brevity as it's not currently required by the Context
        throw new Error("Method not implemented");
    }

    getUserOrders(userId, callback) {
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', userId)
        );

        return onSnapshot(q, (snapshot) => {
            const userOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(userOrders);
        });
    }

    subscribeToOrders(callback) {
        // For Admin
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const allOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(allOrders);
        });
    }

    async updateOrderStatus(orderId, status) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status });
    }
}
