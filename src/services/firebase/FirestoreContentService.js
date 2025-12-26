import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IContentService } from '../interfaces';

export class FirestoreContentService extends IContentService {
    async getPageContent(pageId, businessId) {
        // If no businessId provided (legacy/platform), use root content collection or default
        if (!businessId) {
            // Fallback for platform pages or legacy
            const docRef = doc(db, 'content', pageId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : {};
        }

        // Structure: businesses/{businessId}/content/{pageId}
        const docRef = doc(db, 'businesses', businessId, 'content', pageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return {};
        }
    }

    async updatePageContent(pageId, content, businessId) {
        if (!businessId) {
            const docRef = doc(db, 'content', pageId);
            await setDoc(docRef, content, { merge: true });
            return content;
        }

        const docRef = doc(db, 'businesses', businessId, 'content', pageId);
        await setDoc(docRef, content, { merge: true });
        return content;
    }
}
