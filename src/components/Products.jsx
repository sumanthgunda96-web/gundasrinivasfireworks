import React, { useState } from 'react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();
    const { products, loading } = useProducts();

    // Dynamically derive categories from products
    const uniqueCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
    const categories = uniqueCategories.length > 1 ? uniqueCategories : ['All', 'Electronics', 'Furniture', 'Fashion', 'Home'];

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white py-20" id="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-serif">Our Collection</h2>
                    <p className="mt-4 max-w-2xl text-xl text-slate-light mx-auto font-light">
                        Discover premium products curated just for you. Quality and satisfaction guaranteed.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 bg-cream p-4 rounded-xl shadow-inner">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        <Filter className="h-5 w-5 text-primary mr-2" />
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-slate-light hover:bg-gray-100 hover:text-primary border border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent sm:text-sm transition-shadow"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="text-center py-20">Loading products...</div>
                ) : (
                    <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 gap-x-8 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-10">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No products found. Check back later!
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                    <div className="w-full h-64 bg-gray-200 overflow-hidden relative">
                                        <img
                                            src={product.imageUrl || product.image || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-full object-center object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-sm">
                                            {product.category || 'General'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-primary font-serif">
                                                <a href="#">
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </a>
                                            </h3>
                                            <p className="text-lg font-bold text-secondary">${product.price}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-light mb-6">In Stock: {product.stock || product.weight || 'Available'}</p>
                                        <div className="mt-auto">
                                            <button
                                                onClick={() => {
                                                    addToCart(product);
                                                    alert(`${product.name} added to cart!`);
                                                }}
                                                className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform active:scale-95"
                                            >
                                                <ShoppingCart className="h-5 w-5 mr-2" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
