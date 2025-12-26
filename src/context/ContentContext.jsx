import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirestoreContentService } from '../services/firebase/FirestoreContentService';

import { useBusiness } from './BusinessContext';

const ContentContext = createContext();

const contentService = new FirestoreContentService();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState({
        home: {},
        about: {},
        contact: {}
    });
    const [loading, setLoading] = useState(true);
    const { currentBusiness } = useBusiness();

    // Initial load of all content when business changes
    useEffect(() => {
        if (currentBusiness) {
            refreshContent();
        }
    }, [currentBusiness]);

    const refreshContent = async () => {
        setLoading(true);
        try {
            const businessId = currentBusiness?.id;
            const home = await contentService.getPageContent('home', businessId);
            const about = await contentService.getPageContent('about', businessId);
            const contact = await contentService.getPageContent('contact', businessId);

            setContent({
                home: home || {},
                about: about || {},
                contact: contact || {}
            });
        } catch (error) {
            console.error("Failed to fetch content:", error);
        } finally {
            setLoading(false);
        }
    };

    const updatePageContent = async (pageId, newContent) => {
        try {
            await contentService.updatePageContent(pageId, newContent, currentBusiness?.id);
            // Optimistic update
            setContent(prev => ({
                ...prev,
                [pageId]: { ...prev[pageId], ...newContent }
            }));
            return true;
        } catch (error) {
            console.error(`Failed to update ${pageId} content:`, error);
            throw error;
        }
    };

    return (
        <ContentContext.Provider value={{ content, updatePageContent, refreshContent, loading }}>
            {children}
        </ContentContext.Provider>
    );
};
