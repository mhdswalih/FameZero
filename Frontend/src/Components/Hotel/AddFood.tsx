import { useState, useEffect } from 'react';
import {
  ChefHat,
  Coffee,
  Pizza,
  Salad,
  Sandwich,
  Fish,
  Beef,
  Drumstick,
  Leaf,
  Cookie,
  Wine,
  IceCream,
  Baby,
  Star,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import NavBar from '../HotelNav&Footer/NavBar';
import { addProducts, deleteProducts, editProducts, getAllMenuList } from '../../Api/hotelApiCalls/hotelProfileApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import ProductModal from '../Modals/Hotel/Products/ProductModal';
import ProductEditModal from '../Modals/Hotel/Products/EditProductModal';
import ConfirmModal from '../Modals/ConfirmModal/ConfirmModals';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const ProductCategories = [
  { value: "", label: "All Categories", icon: ChefHat },
  { value: "Appetizers", label: "Appetizers", icon: Cookie },
  { value: "Main Course", label: "Main Course", icon: ChefHat },
  { value: "Soups", label: "Soups", icon: Coffee },
  { value: "Salads", label: "Salads", icon: Salad },
  { value: "Sandwiches", label: "Sandwiches", icon: Sandwich },
  { value: "Burgers", label: "Burgers", icon: Sandwich },
  { value: "Pizza", label: "Pizza", icon: Pizza },
  { value: "Pasta", label: "Pasta", icon: ChefHat },
  { value: "Seafood", label: "Seafood", icon: Fish },
  { value: "Chicken", label: "Chicken", icon: Drumstick },
  { value: "Beef", label: "Beef", icon: Beef },
  { value: "Vegetarian", label: "Vegetarian", icon: Leaf },
  { value: "Vegan", label: "Vegan", icon: Leaf },
  { value: "Sides", label: "Sides", icon: Cookie },
  { value: "Desserts", label: "Desserts", icon: IceCream },
  { value: "Beverages", label: "Beverages", icon: Coffee },
  { value: "Hot Drinks", label: "Hot Drinks", icon: Coffee },
  { value: "Cold Drinks", label: "Cold Drinks", icon: Coffee },
  { value: "Alcoholic Beverages", label: "Alcoholic Beverages", icon: Wine },
  { value: "Specials", label: "Specials", icon: Star },
  { value: "Kids Menu", label: "Kids Menu", icon: Baby },
];

interface IProductsDetails {
  category: string;
  customCategory: string;
  productName: string;
  price: string;
  quantity: string;
  _id: string;
}

interface IDisPatchedItems {
  productName: string;
  price: number;
  quantity: number;
  _id: string;
}

const AddFood = () => {
  const [menu, setMenus] = useState<IProductsDetails[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const hotelId = useSelector((state: RootState) => state.user.id);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [product, setProducts] = useState<IProductsDetails[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProductsDetails | null>(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: '',
    itemName: ''
  });

  const dispatch = useDispatch();

  // Fetch food items from API
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const res = await getAllMenuList(hotelId);
      const data = res.response || [];
      const matchingHotel = data.find((item: any) => item.hotelId === hotelId);
      if (matchingHotel && matchingHotel.productDetails) {
        setMenus(matchingHotel.productDetails);
        console.log(matchingHotel.productDetails, 'THIS IS MENU');

        matchingHotel.productDetails.forEach(async (product: IDisPatchedItems) => {
          console.log(product, 'THIS IS PRODUCT FROM ADD PAGE');

          dispatch(
            await addProducts(
              {
                _id: product._id,
                productName: product.productName,
                price: product.price,
                quantity: product.quantity
              },
              hotelId
            )
          );
        });
      } else {
        setMenus([]);
      }
    } catch (error) {
      setMenus([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProducts = async (updatedProducts: IProductsDetails[]) => {
    try {
      const response = await addProducts(updatedProducts, hotelId);
      setProducts(updatedProducts);
      toast.success(response?.message);
      setProducts([]);
      fetchMenuItems();
    } catch (error: any) {
      toast.error(error.message || error.error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = ProductCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : ChefHat;
  };

  const openDeleteConfirm = (itemId: string, itemName: string) => {
    setConfirmModal({
      isOpen: true,
      itemId,
      itemName
    });
  };

  const closeDeleteConfirm = () => {
    setConfirmModal({
      isOpen: false,
      itemId: '',
      itemName: ''
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteLoading(true);
      await deleteProducts(confirmModal.itemId);
      toast.success('Item deleted successfully!');
      closeDeleteConfirm();
      fetchMenuItems();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting item');
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const openEditModal = (item: IProductsDetails) => {
    setEditingProduct(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(false);
  };

  const handleEditSave = async (updatedProduct: IProductsDetails) => {
    try {
      console.log(updatedProduct._id,[updatedProduct] + 'THIS IS UPDAYED PRODUCTS ');
      
      setIsEditLoading(true);
      await editProducts([updatedProduct], updatedProduct._id,hotelId);
      setIsEditLoading(false);
      closeEditModal();
      toast.success('Product updated successfully!');
      fetchMenuItems();
    } catch (error: any) {
      setIsEditLoading(false);
      toast.error(error.message || 'Failed to update product');
      throw error;
    }
  };

  const filteredItems = menu.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="font-['Poppins'] min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Add any header content here */}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search food items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white min-w-[180px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {ProductCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center mb-4">
          <button
            className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
            onClick={() => setIsProductModalOpen(true)}
          >
            Add Products
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Food Items Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const IconComponent = getCategoryIcon(item.category);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  {/* Item Image */}
                  <div className="relative h-40 bg-gradient-to-br from-orange-100 to-orange-50 group-hover:from-orange-200 group-hover:to-orange-100 transition-all duration-300 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <IconComponent className="h-12 w-12 text-orange-400" />
                    </div>

                    {/* Availability Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs text-white px-2 py-1 ${Number(item.quantity) > 2 ? 'bg-green-500' : 'bg-red-500'
                          } rounded-full font-medium`}
                      >
                        {Number(item.quantity) > 2 ? 'Available' : 'Low Stock'}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="text-xs bg-orange-400 text-white px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">
                        {item.productName}
                      </h3>
                      <span className="text-xl font-bold text-orange-500 whitespace-nowrap ml-2">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                      {'No description available'}
                    </p>

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Qty: <span className="font-semibold">{item.quantity}</span>
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item._id, item.productName)}
                          className="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        setProducts={setProducts}
        products={product}
        setIsProductModalOpen={setIsProductModalOpen}
        isProductModalOpen={isProductModalOpen}
        handleSaveProducts={handleSaveProducts}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
      />

    
      <ProductEditModal
        isOpen={isEditModalOpen}
        product={editingProduct}
        onClose={closeEditModal}
        onSave={handleEditSave}
        isSubmitting={isEditLoading}
      />
    </section>
  );
};

export default AddFood;