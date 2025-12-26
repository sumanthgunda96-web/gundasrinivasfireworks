import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import { useContent } from '../context/ContentContext';
import { contentDefaults } from '../constants/contentDefaults';

const Footer = () => {
    const { currentBusiness } = useBusiness();
    const { content } = useContent();
    const storeUrl = `/a2z/${currentBusiness?.slug}`;

    return (
        <footer className="bg-night text-white pt-16 pb-8 border-t border-night-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 font-serif text-cream">{currentBusiness?.name || 'Store'}</h3>
                        <p className="text-cream-dark mb-6 leading-relaxed font-light">
                            Your trusted partner for quality products. Delivering excellence and value to customers worldwide.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-cream-dark hover:text-secondary transition-colors"><Facebook className="h-6 w-6" /></a>
                            <a href="#" className="text-cream-dark hover:text-secondary transition-colors"><Twitter className="h-6 w-6" /></a>
                            <a href="#" className="text-cream-dark hover:text-secondary transition-colors"><Instagram className="h-6 w-6" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 font-serif text-cream">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to={storeUrl} className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">Home</Link></li>
                            <li><Link to={`${storeUrl}/products`} className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">Our Products</Link></li>
                            <li><Link to={`${storeUrl}/about`} className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">About Us</Link></li>
                            <li><Link to={`${storeUrl}/contact`} className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 font-serif text-cream">{content.contact?.title || contentDefaults.contact.title}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="h-6 w-6 mr-3 text-secondary mt-1 flex-shrink-0" />
                                <div className="text-cream-dark">
                                    <p className="font-bold text-cream mb-1">Shop Address:</p>
                                    <p className="mb-2">
                                        Headquarters,<br />
                                        Business District, Tech City
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-6 w-6 mr-3 text-secondary flex-shrink-0" />
                                <span className="text-cream-dark">{content.contact?.phone || contentDefaults.contact.phone}</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-6 w-6 mr-3 text-secondary flex-shrink-0" />
                                <span className="text-cream-dark">{content.contact?.email || contentDefaults.contact.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-night-light mt-16 pt-8 text-center text-cream-dark/60 text-sm">
                    <p>&copy; {new Date().getFullYear()} {currentBusiness?.name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
