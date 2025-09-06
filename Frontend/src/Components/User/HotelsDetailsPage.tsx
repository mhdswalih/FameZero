import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Filter,
  Search
} from 'lucide-react';
import  Navbar  from '../UserNav&Footer/Navbar';
import { getAllMenuList } from '../../Api/hotelApiCalls/hotelProfileApi';
import { addToCart } from '../../Api/userApiCalls/productApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import toast from 'react-hot-toast';

// Mock Navbar component since it's imported

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
  _id:string;
  category: string,
  productName: string,
  price: string,
  quantity: string,
}

const MenuListingPage = () => {
  const { hotelId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [menus,setMenus] = useState<IProductsDetails[]>([])
  const userId = useSelector((state:RootState)=> state.userProfile._id)
  const fetchMenuItems = async()=>{
    try {
     const response =  await getAllMenuList(hotelId as string)
      const matchingHotel = response.response.find((item: any) => item.hotelId === hotelId); 
    if (matchingHotel && matchingHotel.productDetails) {
      setMenus(matchingHotel.productDetails);
    }
    } catch (error) {
      setMenus([])
    }
  }
  useEffect(()=>{
    if(hotelId){
      fetchMenuItems()
    }
  },[hotelId])

  const getCategoryIcon = (category:string) => {
    const categoryData = ProductCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : ChefHat;
  };

  
  const handleAddCart = async(productId:string)=>{ 
    try {
      const response = await addToCart(productId,userId as string,hotelId as string)
      toast.success(response.message)
    } catch (error) {
      
    }
  }
  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <div className="w-full max-w-7xl px-4">
          <Navbar />
        </div>
      </div>

      <section className="font-['Poppins'] min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully crafted dishes made with the finest ingredients
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white min-w-[200px]"
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

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {ProductCategories.slice(0, 8).map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedCategory === category.value
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {menus.length} {menus.length === 1 ? 'item' : 'items'}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menus.map((item) => {
              const IconComponent = getCategoryIcon(item.category);
              return (
                <div 
                  key={item.productName}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Item Image - Replaced with category icon */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 group-hover:from-orange-200 group-hover:to-orange-100 transition-all duration-300 flex items-center justify-center">
                    <IconComponent className="h-16 w-16 text-orange-400" />
                    
                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs text-white px-2 py-1 ${Number(item.quantity) > 2 ? 'bg-orange-400' : 'bg-red-500'} rounded-full font-medium`}>
                        {Number(item.quantity) > 2 ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                        {item.productName}
                      </h3>
                      <span className="text-2xl font-bold text-orange-500">{item.price}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {/* {renderStars(item.rating)} */}
                      </div>
                      <span className="text-sm text-gray-500">
                        {/* {item.rating} ({item.revies} reviews) */}
                      </span>
                    </div>

                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-4">
                      <IconComponent className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-500 font-medium">{item.category}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button onClick={()=>handleAddCart(item._id)} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium">
                        Add to Cart
                      </button>
                      <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {menus.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MenuListingPage;