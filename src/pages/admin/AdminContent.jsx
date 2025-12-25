import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminContent = () => {
    const { content, updatePageContent, loading: contextLoading } = useContent();
    const [activeTab, setActiveTab] = useState('home');
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (content[activeTab]) {
            setFormData(content[activeTab]);
        }
    }, [content, activeTab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updatePageContent(activeTab, formData);
            setMessage({ type: 'success', text: 'Content saved successfully!' });
        } catch (error) {
            console.error("Save error:", error);
            setMessage({ type: 'error', text: 'Failed to save content.' });
        } finally {
            setSaving(false);
        }
    };

    if (contextLoading) return <div className="p-8 text-center">Loading content...</div>;

    const renderField = (key, label, type = 'text') => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {label || key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary border p-2"
                />
            ) : (
                <input
                    type={type}
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary border p-2"
                />
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Content Management</h2>
                {message && (
                    <div className={`px-4 py-2 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {['home', 'about', 'contact'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium capitalize transition-colors ${activeTab === tab
                                ? 'bg-primary text-white'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    <form onSubmit={handleSave}>
                        {activeTab === 'home' && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Hero Section</h3>
                                {renderField('heroTitle', 'Main Title')}
                                {renderField('heroSubtitle', 'Subtitle')}
                                {renderField('heroDescription', 'Description', 'textarea')}
                                {renderField('heroButtonText', 'Button Text')}
                                <h3 className="text-lg font-bold mb-4 mt-6">Announcement Bar</h3>
                                {renderField('announcement', 'Announcement Text')}
                            </>
                        )}

                        {activeTab === 'about' && (
                            <>
                                <h3 className="text-lg font-bold mb-4">About Section</h3>
                                {renderField('title', 'Section Title')}
                                {renderField('mainHeading', 'Main Heading')}
                                {renderField('description', 'Description', 'textarea')}
                            </>
                        )}

                        {activeTab === 'contact' && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Contact Section</h3>
                                {renderField('title', 'Header Title')}
                                {renderField('subtitle', 'Subtitle', 'textarea')}
                                {renderField('phone', 'Phone Number')}
                                {renderField('email', 'Email Address')}
                            </>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;
