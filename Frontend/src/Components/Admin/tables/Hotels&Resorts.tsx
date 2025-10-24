import { useCallback, useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import {
  fetchHotels,
  accptRequst,
  rejectrequst,
  blockHotel,
  unBlockHotel,
} from '../../../Api/adminApiCalls/adminApi';
import toast from 'react-hot-toast';
import SocketService from '../../../utils/socket-service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import CombinedLayout from '../sidesheet/AdminSideSheet';

interface IHotelProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  idProof?: string;
  status: string;
  profilepic?: string;
  location?: string;
  city?: string;
  phone?: string;
  isBlocked: boolean;
}

const HotelsTable = () => {
  const [hotels, setHotels] = useState<IHotelProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search,setSearch] = useState('')
  const token = useSelector((state: RootState) => state.admin.token);

  const getHotels = async (pageNum = 1) => {
    try {
      const response = await fetchHotels(pageNum, 5,search);
      console.log(response,'THISIS SEARCH DATA ');
      
      setHotels(response.data.hotels || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.currentPage || 1);
    } catch (err) {
      toast.error('Failed to fetch hotels');
    }
  };

  // ✅ Accept hotel request
  const acceptRequest = async (id: string) => {
    setLoading(true);
    try {
      await accptRequst(id);
      await getHotels(page);
      toast.success('Request accepted successfully');
    } catch {
      toast.error('Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reject hotel request
  const rejectRequst = async (id: string) => {
    setLoading(true);
    try {
      await rejectrequst(id);
      await getHotels(page);
      toast.success('Request rejected successfully');
    } catch {
      toast.error('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle status updates via socket
  const handleStatusUpdate = useCallback(
    async (data: { id: string; status: string }) => {
      console.log('Status update received', data);
      setHotels((prev) =>
        prev.map((hotel) =>
          hotel._id === data.id ? { ...hotel, status: data.status } : hotel
        )
      );
    },
    []
  );

  // ✅ Socket setup
  useEffect(() => {
    const socketService = SocketService.getInstance();
    if (!socketService.isConnected()) {
      socketService.connect({ role: 'admin', token, id: '' });
    }
    socketService.on('hotel-status-changed', handleStatusUpdate);

    return () => {
      const socketService = SocketService.getInstance();
      socketService.off('hotel-status-changed', handleStatusUpdate);
      socketService.off('room-joined');
    };
  }, [handleStatusUpdate, token]);

  // ✅ Block/Unblock hotel
  const blockuser = async (id: string) => {
    try {
      await blockHotel(id);
      toast.success('User blocked successfully');
      await getHotels(page);
    } catch {
      toast.error('Failed to block user');
    }
  };

  const unBlockuser = async (id: string) => {
    try {
      await unBlockHotel(id);
      toast.success('User reinstated successfully');
      await getHotels(page);
    } catch {
      toast.error('Failed to reinstate user');
    }
  };

 
  useEffect(() => {
    getHotels(page);
  }, [page,search]);

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    getHotels(1); 
  }, 500); 

  return () => clearTimeout(delayDebounce);
}, [search]);

  return (
    <div>
      <CombinedLayout>
        <h3 className="text-lg font-semibold mb-4">Hotels & Resorts Management</h3>
        <div className="flex justify-end items-center">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            className="border border-black bg-black text-white px-2 py-1 rounded"
            placeholder="Search..."
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-orange-400 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-black">
              <tr>
                {['Name', 'Email', 'Mobile', 'Status', 'Actions'].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-black divide-y divide-gray-200">
              {Array.isArray(hotels) && hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <tr key={hotel._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {hotel.profilepic ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={hotel.profilepic}
                              alt={hotel.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <FaUserCircle className="h-10 w-10 text-orange-400" />
                          )}
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-100">
                          {hotel.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-100 text-sm">
                      {hotel.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100 text-sm">
                      {hotel.phone}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hotel.status === 'Pending'
                            ? 'bg-orange-400 text-white'
                            : hotel.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {hotel.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {hotel.status === 'Pending' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => acceptRequest(hotel._id)}
                              disabled={loading}
                              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 px-3 py-1 rounded-md text-white text-sm transition-colors"
                            >
                              {loading ? 'Processing...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => rejectRequst(hotel._id)}
                              disabled={loading}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white text-sm transition-colors"
                            >
                              {loading ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        )}

                        {hotel.status === 'Approved' && (
                          <div>
                            {hotel.isBlocked ? (
                              <button
                                onClick={() => unBlockuser(hotel.userId)}
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white text-sm transition-colors"
                              >
                                Reinstate
                              </button>
                            ) : (
                              <button
                                onClick={() => blockuser(hotel.userId)}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white text-sm transition-colors"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-400 py-4 text-sm"
                  >
                    No hotels found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 py-4 bg-black border-t border-gray-700">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Prev
              </button>

              <span className="text-orange-400">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </CombinedLayout>
    </div>
  );
};

export default HotelsTable;
