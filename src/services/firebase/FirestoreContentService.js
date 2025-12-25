import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IContentService } from '../interfaces';

export class FirestoreContentService extends IContentService {
    async getPageContent(pageId) {
        const docRef = doc(db, 'content', pageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Return default/empty structure if not found to prevent crashes
            return {};
        }
    }

    async updatePageContent(pageId, content) {
        const docRef = doc(db, 'content', pageId);
        // use setDoc with merge: true to create if not exists or update
        await setDoc(docRef, content, { merge: true });
        return content;
    }
}
