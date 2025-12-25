import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirestoreContentService } from '../services/firebase/FirestoreContentService';

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

    // Initial load of all content
    useEffect(() => {
        refreshContent();
    }, []);

    const refreshContent = async () => {
        setLoading(true);
        try {
            const home = await contentService.getPageContent('home');
            const about = await contentService.getPageContent('about');
            const contact = await contentService.getPageContent('contact');

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
            await contentService.updatePageContent(pageId, newContent);
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
