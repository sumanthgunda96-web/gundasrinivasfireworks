import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Package, Briefcase, RefreshCw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

const AdminProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Toggle for custom category input
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        price: '',
        weight: '', // Used for Weight (Physical) or Duration (Service)
        image: '',
        type: 'physical' // 'physical' or 'service'
    });

    const categories = ['Electronics', 'Fashion', 'Home & Living', 'Groceries', 'Beauty', 'Toys', 'Sports'];

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                type: product.type || 'physical' // Backward compatibility
            });
            // If category is not in default list, switch to custom mode
            setIsCustomCategory(!categories.includes(product.category));
        } else {
            setEditingProduct(null);
            setIsCustomCategory(false);
            setFormData({
                name: '',
                category: 'Electronics',
                price: '',
                weight: '',
                image: '',
                type: 'physical'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await addProduct(formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Products & Services</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image || 'https://via.placeholder.com/40'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.type === 'service' ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                            Service
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Product
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.weight}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingProduct ? 'Edit Item' : 'Add New Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Type Toggle */}
                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'physical' })}
                                    className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${formData.type === 'physical' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Physical Product
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'service' })}
                                    className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${formData.type === 'service' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    Service
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={formData.type === 'physical' ? "e.g. Wireless Headphones" : "e.g. Web Design Consultation"}
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustomCategory(!isCustomCategory);
                                            // Reset category when switching modes
                                            setFormData(prev => ({
                                                ...prev,
                                                category: !isCustomCategory ? '' : 'Electronics'
                                            }));
                                        }}
                                        className="text-xs text-primary hover:text-primary-dark flex items-center"
                                    >
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        {isCustomCategory ? "Select from list" : "Create new"}
                                    </button>
                                </div>

                                {isCustomCategory ? (
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Type your category name..."
                                        autoFocus
                                    />
                                ) : (
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            {/* Conditional Field: Weight vs Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {formData.type === 'physical' ? "Weight / Stock Quantity" : "Duration / Details"}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    placeholder={formData.type === 'physical' ? "e.g. 500g, 10 in stock" : "e.g. 1 hour session, Monthly subscription"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
