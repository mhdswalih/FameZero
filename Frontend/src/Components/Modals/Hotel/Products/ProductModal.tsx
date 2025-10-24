import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, X, Save, ChevronDown, ChevronUp, Minus, ChevronsUpDown, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';

interface IProductsDetails {
    _id: string;
    category: string;
    customCategory: string;
    productName: string;
    price: string;
    quantity: string;
}

interface ProductModalProps {
    isProductModalOpen: boolean;
    setIsProductModalOpen: (open: boolean) => void;
    products: IProductsDetails[];
    setProducts: (products: IProductsDetails[]) => void;
    handleSaveProducts: (products: IProductsDetails[]) => Promise<void>;
    isSubmitting?: boolean;
}

const ProductModal = ({
    isProductModalOpen,
    setIsProductModalOpen,
    products,
    handleSaveProducts,
    isSubmitting = false
}: ProductModalProps) => {
    const temId =  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const [localProducts, setLocalProducts] = useState<IProductsDetails[]>(products);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showCustomCategory, setShowCustomCategory] = useState<boolean[]>([]);
    const [newProducts, setNewProducts] = useState<IProductsDetails[]>([
        {
            category: '', customCategory: '', productName: '', price: '', quantity: '',
            _id: temId
        }
    ]);

    const ProductCategories = [
        { value: "", label: "Select a category" },
        { value: "Appetizers", label: "Appetizers" },
        { value: "Main Course", label: "Main Course" },
        { value: "Soups", label: "Soups" },
        { value: "Salads", label: "Salads" },
        { value: "Sandwiches", label: "Sandwiches" },
        { value: "Burgers", label: "Burgers" },
        { value: "Pizza", label: "Pizza" },
        { value: "Pasta", label: "Pasta" },
        { value: "Seafood", label: "Seafood" },
        { value: "Chicken", label: "Chicken" },
        { value: "Beef", label: "Beef" },
        { value: "Vegetarian", label: "Vegetarian" },
        { value: "Vegan", label: "Vegan" },
        { value: "Sides", label: "Sides" },
        { value: "Desserts", label: "Desserts" },
        { value: "Beverages", label: "Beverages" },
        { value: "Hot Drinks", label: "Hot Drinks" },
        { value: "Cold Drinks", label: "Cold Drinks" },
        { value: "Alcoholic Beverages", label: "Alcoholic Beverages" },
        { value: "Specials", label: "Specials" },
        { value: "Kids Menu", label: "Kids Menu" },
        { value: "Other", label: "Other (type custom)" },
    ];

    // Initialize with existing products when modal opens
    useEffect(() => {
        if (isProductModalOpen) {
            setLocalProducts(products);
            const categories = new Set(products.map(p => p.category));
            setExpandedCategories(categories);
            setNewProducts([{
                category: '', customCategory: '', productName: '', price: '', quantity: '',
                _id: temId
            }]);
            setShowCustomCategory([false]);
            setEditingIndex(null);
        }
    }, [isProductModalOpen, products]);

    const handleCancel = () => {
        setLocalProducts(products);
        setEditingIndex(null);
        setNewProducts([{
            category: '', customCategory: '', productName: '', price: '', quantity: '',
            _id: temId
        }]);
        setIsProductModalOpen(false);
    };

    const handleSave = async () => {
        try {
            await handleSaveProducts(localProducts);
            setEditingIndex(null);
            setNewProducts([{
                category: '', customCategory: '', productName: '', price: '', quantity: '',
                _id: temId
            }]);
            setIsProductModalOpen(false);
        } catch (error) {
            console.error('Failed to save products:', error);
        }
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const addNewProductField = () => {
        setNewProducts([...newProducts, {
            category: '', customCategory: '', productName: '', price: '', quantity: '',
            _id: temId
        }]);
        setShowCustomCategory([...showCustomCategory, false]);
    };

    const removeNewProductField = (index: number) => {
        if (newProducts.length === 1) {
            setNewProducts([{
                category: '', customCategory: '', productName: '', price: '', quantity: '',
                _id: temId
            }]);
            setShowCustomCategory([false]);
            return;
        }

        const updatedNewProducts = newProducts.filter((_, i) => i !== index);
        const updatedShowCustom = showCustomCategory.filter((_, i) => i !== index);
        setNewProducts(updatedNewProducts);
        setShowCustomCategory(updatedShowCustom);
    };

    const handleNewProductChange = (index: number, field: keyof IProductsDetails, value: string) => {
        const updatedNewProducts = [...newProducts];
        updatedNewProducts[index] = {
            ...updatedNewProducts[index],
            [field]: value
        };
        setNewProducts(updatedNewProducts);
    };

    const handleCategoryChange = (index: number, value: string) => {
        const updatedNewProducts = [...newProducts];
        updatedNewProducts[index] = {
            ...updatedNewProducts[index],
            category: value
        };
        setNewProducts(updatedNewProducts);

        const updatedShowCustom = [...showCustomCategory];
        updatedShowCustom[index] = value === "Other";
        setShowCustomCategory(updatedShowCustom);
    };

    const addProducts = () => {
        const validNewProducts = newProducts.filter(
            product => {
                const category = product.category === "Other" ? product.customCategory : product.category;
                return category && product.productName && product.price && product.quantity;
            }
        );

        if (validNewProducts.length === 0) {
            toast.error('Please fill at least one product');
            return;
        }

        // Process products - use customCategory if category is "Other" and generate IDs
        const processedProducts = validNewProducts.map(product => ({
            ...product,
            category: product.category === "Other" ? product.customCategory : product.category,
            _id: product._id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));

        const updatedProducts = [...localProducts, ...processedProducts];
        setLocalProducts(updatedProducts);

        const newCategories = new Set(expandedCategories);
        processedProducts.forEach(product => {
            if (product.category && !newCategories.has(product.category)) {
                newCategories.add(product.category);
            }
        });
        setExpandedCategories(newCategories);

        setNewProducts([{
            category: '', customCategory: '', productName: '', price: '', quantity: '',
            _id: temId
        }]);
        setShowCustomCategory([false]);
        toast.success(`Added ${validNewProducts.length} product(s)`);
    };

    const startEdit = (index: number) => {
        setEditingIndex(index);
    };

    const saveEdit = () => {
        if (editingIndex === null) return;
        setEditingIndex(null);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setLocalProducts([...localProducts]); 
    };

    const updateEditingProduct = (field: keyof IProductsDetails, value: string) => {
        if (editingIndex === null) return;
        const updatedProducts = [...localProducts];
        updatedProducts[editingIndex] = {
            ...updatedProducts[editingIndex],
            [field]: value
        };
        setLocalProducts(updatedProducts);
    };

    const deleteProduct = async (index: number) => {
        const productToDelete = localProducts[index];
        
        // Only send to backend if it has a real ID (not a temporary one)
        if (productToDelete._id && !productToDelete._id.startsWith('temp_')) {
            try {
                const updatedProducts = localProducts.filter((_, i) => i !== index);
                setLocalProducts(updatedProducts);
                setEditingIndex(null);
                toast.success('Product deleted');
            } catch (error) {
                console.error('Failed to delete product:', error);
                toast.error('Failed to delete product');
            }
        } else {
            // For temporary products (not yet saved to database), just remove locally
            const updatedProducts = localProducts.filter((_, i) => i !== index);
            setLocalProducts(updatedProducts);
            setEditingIndex(null);
            toast.success('Product deleted');
        }
    };

    const categories = [...new Set(localProducts.map(p => p.category))];

    return (
        <AnimatePresence>
            {isProductModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50"
                    onClick={() => setIsProductModalOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-white p-6 border-b border-gray-100 sticky top-0 z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Manage Products</h2>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="h-5 w-5 text-gray-700" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Add, edit, or delete your products</p>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-grow">
                            {/* Add New Products Form */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Add New Products</h3>
                                    <button
                                        onClick={addNewProductField}
                                        className="bg-orange-400 hover:bg-orange-500 text-white py-1 px-3 rounded text-sm flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add Field
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {newProducts.map((product, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <div className="relative">
                                                    <Listbox value={product.category} onChange={(value: string) => handleCategoryChange(index, value)}>
                                                        <div className="relative">
                                                            <Listbox.Button className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-left flex items-center justify-between">
                                                                <span className="block truncate">
                                                                    {product.category ? ProductCategories.find(cat => cat.value === product.category)?.label || product.category : "Select a category"}
                                                                </span>
                                                                <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                                                            </Listbox.Button>
                                                            <Transition
                                                                as={React.Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {ProductCategories.map((category) => (
                                                                        <Listbox.Option
                                                                            key={category.value}
                                                                            className={({ active }: { active: boolean }) =>
                                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'}`
                                                                            }
                                                                            value={category.value}
                                                                        >
                                                                            {({ selected }: { selected: boolean }) => (
                                                                                <>
                                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                                        {category.label}
                                                                                    </span>
                                                                                    {selected ? (
                                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                                                                                            <Check className="h-5 w-5" />
                                                                                        </span>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    ))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </Listbox>
                                                    {showCustomCategory[index] && (
                                                        <input
                                                            type="text"
                                                            value={product.customCategory || ""}
                                                            onChange={(e) => handleNewProductChange(index, 'customCategory', e.target.value)}
                                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                            placeholder="Enter custom category"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                                <input
                                                    type="text"
                                                    value={product.productName}
                                                    onChange={(e) => handleNewProductChange(index, 'productName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                    placeholder="e.g., Spring Rolls"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={product.price}
                                                    onChange={(e) => handleNewProductChange(index, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={product.quantity}
                                                    onChange={(e) => handleNewProductChange(index, 'quantity', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="flex justify-end pb-1">
                                                <button
                                                    onClick={() => removeNewProductField(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                                    title="Remove field"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={addProducts}
                                    className="mt-4 bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add All Products
                                </button>
                            </div>

                            {/* Products List by Category */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Products</h3>

                                {categories.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No products added yet. Start by adding products above.
                                    </div>
                                ) : (
                                    categories.map((category) => (
                                        <div key={category} className="mb-6">
                                            <div
                                                className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer hover:bg-gray-200 transition-colors"
                                                onClick={() => toggleCategory(category)}
                                            >
                                                <h4 className="font-medium text-gray-900">{category}</h4>
                                                <button>
                                                    {expandedCategories.has(category) ? (
                                                        <ChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>

                                            {expandedCategories.has(category) && (
                                                <div className="border border-gray-200 border-t-0 rounded-b-lg overflow-hidden">
                                                    {localProducts
                                                        .map((product, globalIndex) => ({ product, globalIndex }))
                                                        .filter(({ product }) => product.category === category)
                                                        .map(({ product, globalIndex }) => {
                                                            return editingIndex === globalIndex ? (
                                                                // Edit Mode
                                                                <div key={globalIndex} className="p-4 border-b border-gray-200 last:border-b-0 bg-orange-50">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                                            <input
                                                                                type="text"
                                                                                value={product.category}
                                                                                onChange={(e) => updateEditingProduct('category', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                                                            <input
                                                                                type="text"
                                                                                value={product.productName}
                                                                                onChange={(e) => updateEditingProduct('productName', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                step="0.01"
                                                                                value={product.price}
                                                                                onChange={(e) => updateEditingProduct('price', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                value={product.quantity}
                                                                                onChange={(e) => updateEditingProduct('quantity', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-end pb-1">
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={saveEdit}
                                                                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center gap-1"
                                                                                >
                                                                                    <Save className="h-3 w-3" /> Save
                                                                                </button>
                                                                                <button
                                                                                    onClick={cancelEdit}
                                                                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                // View Mode
                                                                <div key={globalIndex} className="p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center">
                                                                    <div className="flex-1 grid grid-cols-4 gap-4">
                                                                        <div>
                                                                            <div className="font-medium text-gray-900">{product.productName}</div>
                                                                            <div className="text-sm text-gray-600">{product.category}</div>
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            <div className="text-gray-500">Price</div>
                                                                            <div>${product.price}</div>
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            <div className="text-gray-500">Quantity</div>
                                                                            <div>{product.quantity}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => startEdit(globalIndex)}
                                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                                            title="Edit"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteProduct(globalIndex)}
                                                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0">
                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={isSubmitting || localProducts.length === 0}
                                    className="bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Products'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;