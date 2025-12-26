import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IProductService } from '../interfaces';

export class FirestoreProductService extends IProductService {
    async getAllProducts() {
        // Keep this for one-time fetches if needed
        const querySnapshot = await getDocs(collection(db, 'products'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    subscribeToProducts(callback) {
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(products);
        }, (error) => {
            console.error("Error subscribing to products:", error);
            callback([]); // Return empty on error
        });
        return unsubscribe;
    }

    async addProduct(productData, businessId) {
        const dataWithBusiness = businessId ? { ...productData, businessId } : productData;
        const docRef = await addDoc(collection(db, 'products'), dataWithBusiness);
        return { id: docRef.id, ...dataWithBusiness };
    }

    async updateProduct(productId, updates) {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, updates);
        return { id: productId, ...updates };
    }

    async deleteProduct(productId) {
        await deleteDoc(doc(db, 'products', productId));
        return true;
    }
}
