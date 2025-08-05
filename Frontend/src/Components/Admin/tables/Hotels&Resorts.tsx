import { useEffect, useState } from 'react';
import { FaUserCircle} from 'react-icons/fa';
import CombinedLayout from '../sidesheet/AdminSideSheet';
import { fetchHotels, accptRequst, rejectrequst } from '../../../Api/adminApiCalls/adminApi'; 
import toast from 'react-hot-toast';

interface HotelDetails { 
  _id: string;
  name: string;
  email: string;
  phone: string;
  idProof: string;
  profilepic: string;
  status: string;
  location: string;
  city: string; 
}

const HotelsTable = () => {
  const [hotels, setHotels] = useState<HotelDetails[]>([]);
  const [loading, setLoading] = useState(false);
    
  const getHotels = async () => {
    try {
      const response = await fetchHotels(); 
      setHotels(response.data); 
    } catch (err) {
      toast.error('Failed to fetch hotels');
    }
  };
  
  const acceptRequest = async (id: string) => {
    setLoading(true);
    try {
      await accptRequst(id);
      await getHotels();
      toast.success('Request accepted successfully');
    } catch (error) {
      toast.error('Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const rejectRequst = async(id:string) =>{
    setLoading(true);
    try {
      await rejectrequst(id)
      await getHotels()
      toast.success('Request Rejected successfully');
    } catch (error) {
        toast.error('Failed to Reject request');
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getHotels();
  }, []);



  return (
    <div>
      <CombinedLayout>
        <div className="overflow-x-auto rounded-lg border border-orange-400 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-black">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Mobile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-black divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel._id} className=""> {/* Use hotel._id instead of index */}
                  {/* Hotel Column with Avatar and Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {hotel.profilepic ? (
                          // Check for profilepic specifically
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={hotel.profilepic} 
                            alt={hotel.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <FaUserCircle className="h-10 w-10 text-orange-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">{hotel.name}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Email Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">{hotel.email}</div>
                  </td>
                  
                  {/* Mobile Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">{hotel.phone}</div>
                  </td>
                  
                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      hotel.status === 'Pending' 
                        ? 'bg-orange-400 text-white' 
                        : hotel.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {hotel.status}
                    </span>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {hotel.status === 'Pending' && (
                        <div className='flex gap-3'>
                          <button  
                            onClick={() => acceptRequest(hotel._id)} 
                            disabled={loading}
                            className='bg-green-500 hover:bg-green-600 disabled:opacity-50 px-3 py-1 rounded-md text-white text-sm transition-colors'
                          >
                            {loading ? 'Processing...' : 'Accept'}
                          </button>
                          <button 
                          onClick={()=>rejectRequst(hotel._id)}
                          disabled={loading}
                            className='bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white text-sm transition-colors'
                          >  {loading ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      )}
                      
                      {hotel.status === 'Rejected' && (
                        <div className='text-red-500 font-bold'>
                          <p>Rejected</p> 
                        </div>
                      )}
                      
                      {hotel.status === 'Approved' && (
                        <div>
                          <button 
                            className='bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white text-sm transition-colors'
                          >
                            Block
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CombinedLayout>
    </div>
  );
};

export default HotelsTable;