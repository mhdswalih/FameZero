import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronsUpDown, Check } from 'lucide-react';

interface IProductsDetails {
  category: string;
  customCategory: string;
  productName: string;
  price: string;
  quantity: string;
  _id: string;
}

interface ProductEditModalProps {
  isOpen: boolean;
  product: IProductsDetails | null;
  onClose: () => void;
  onSave: (updatedProduct: IProductsDetails) => Promise<void>;
  isSubmitting?: boolean;
}

const ProductCategories = [
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

const ProductEditModal = ({
  isOpen,
  product,
  onClose,
  onSave,
  isSubmitting = false
}: ProductEditModalProps) => {
  const [editedProduct, setEditedProduct] = useState<IProductsDetails | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
      setShowCustomCategory(product.category === 'Other');
    }
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editedProduct?.productName?.trim()) {
      newErrors.productName = 'Product name is required';
    }

    const category = editedProduct?.category === 'Other' 
      ? editedProduct?.customCategory 
      : editedProduct?.category;
    
    if (!category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!editedProduct?.price || Number(editedProduct.price) < 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!editedProduct?.quantity || Number(editedProduct.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !editedProduct) return;

    try {
      const productToSave = {
        ...editedProduct,
        category: editedProduct.category === 'Other' 
          ? editedProduct.customCategory 
          : editedProduct.category
      };
      
      await onSave(productToSave);
      toast.success('Product updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleCategoryChange = (value: string) => {
    if (!editedProduct) return;
    
    setEditedProduct({
      ...editedProduct,
      category: value
    });
    setShowCustomCategory(value === 'Other');
    setErrors({ ...errors, category: '' });
  };

  const handleFieldChange = (field: keyof IProductsDetails, value: string) => {
    if (!editedProduct) return;

    setEditedProduct({
      ...editedProduct,
      [field]: value
    });

    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!editedProduct) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Edit Product</h2>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editedProduct.productName}
                    onChange={(e) => handleFieldChange('productName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all ${
                      errors.productName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Margherita Pizza"
                    disabled={isSubmitting}
                  />
                  {errors.productName && (
                    <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <Listbox 
                    value={editedProduct.category} 
                    onChange={handleCategoryChange}
                    disabled={isSubmitting}
                  >
                    <div className="relative">
                      <Listbox.Button className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-left flex items-center justify-between transition-all ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}>
                        <span className="block truncate">
                          {ProductCategories.find(cat => cat.value === editedProduct.category)?.label || editedProduct.category}
                        </span>
                        <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                      </Listbox.Button>
                      <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white border border-gray-300 py-1 text-base shadow-lg focus:outline-none">
                          {ProductCategories.map((category) => (
                            <Listbox.Option
                              key={category.value}
                              className={({ active }: { active: boolean }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                                }`
                              }
                              value={category.value}
                            >
                              {({ selected }: { selected: boolean }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                    {category.label}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                                      <Check className="h-5 w-5" />
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Custom Category */}
                {showCustomCategory && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Category
                    </label>
                    <input
                      type="text"
                      value={editedProduct.customCategory}
                      onChange={(e) => handleFieldChange('customCategory', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                      placeholder="Enter custom category"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedProduct.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editedProduct.quantity}
                    onChange={(e) => handleFieldChange('quantity', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end sticky bottom-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductEditModal;