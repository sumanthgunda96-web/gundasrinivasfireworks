import {
    collection,
    doc,
    setDoc,
    getDoc,
    query,
    where,
    getDocs,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export class FirestoreBusinessService {
    async createBusiness(businessData) {
        // 1. Check if slug is taken
        const slugTaken = await this.isSlugTaken(businessData.slug);
        if (slugTaken) {
            throw new Error('Store URL is already taken. Please choose another.');
        }

        // 2. Create Business Document
        // ID can be auto-gen or based on slug. Let's use auto-gen ID but store slug index
        const businessRef = doc(collection(db, 'businesses'));
        const businessId = businessRef.id;

        const newBusiness = {
            id: businessId,
            ...businessData,
            createdAt: new Date().toISOString()
        };

        await setDoc(businessRef, newBusiness);
        return newBusiness;
    }

    async isSlugTaken(slug) {
        const q = query(collection(db, 'businesses'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }

    async getBusinessBySlug(slug) {
        const q = query(collection(db, 'businesses'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;

        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
    }

    async getBusinessByOwner(ownerId) {
        const q = query(collection(db, 'businesses'), where('ownerId', '==', ownerId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    // --- Admin Methods ---

    async getAllBusinesses() {
        const q = query(collection(db, 'businesses'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async updateBusinessStatus(businessId, status, rejectionReason = '') {
        const businessRef = doc(db, 'businesses', businessId);
        await setDoc(businessRef, {
            status,
            rejectionReason,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }

    async deleteBusiness(businessId) {
        const businessRef = doc(db, 'businesses', businessId);
        // Note: In a real app, we should also delete subcollections (products, orders)
        // or use a cloud function for recursive delete.
        await deleteDoc(businessRef);
    }
}
