import { FaUserCircle } from 'react-icons/fa';
import { blockHotel, fetchUser, unBlockHotel } from '../../../Api/adminApiCalls/adminApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CombinedLayout from '../sidesheet/AdminSideSheet';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  role: string;
  status: string;
  isBlocked: boolean;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search ,setSearch] = useState('')
  const fetchUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetchUser(pageNum, 5,search);

      if (response && response.success) {
        setUsers(response.data || []);
        setTotalPages(response.totalPages || 1);
        setPage(response.currentPage || pageNum);

      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const blockuser = async (id: string) => {
    try {
      await blockHotel(id);
      toast.success('User Suspended');
      fetchUsers(page);
    } catch {
      toast.error('Failed to Suspend User');
    }
  };

  const unBlockuser = async (id: string) => {
    try {
      await unBlockHotel(id);
      toast.success('User Reinstated');
      fetchUsers(page);
    } catch {
      toast.error('Failed to Reinstate User');
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page,search]);

  useEffect(() => {
    const deleyDebounce = setTimeout(() => {
      fetchUsers(1)
    },500)
    return () => clearTimeout(deleyDebounce)
  },[search])

  if (loading)  <div className="text-orange-400 text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <CombinedLayout>
      <h3 className="text-lg font-semibold mb-4">User Management</h3>
      <div className="flex justify-end items-center">
        <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border border-black bg-black text-white px-2 py-1 rounded"
          placeholder="Search..."
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-orange-400 shadow-sm">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No users found</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-orange-400 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-black divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <FaUserCircle className="h-10 w-10 text-orange-400" />
                      )}
                      <span className="ml-3 text-sm font-medium text-white">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-300">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                          }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.isBlocked ? (
                        <button
                          onClick={() => unBlockuser(user._id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white text-sm"
                        >
                          Reinstate
                        </button>
                      ) : (
                        <button
                          onClick={() => blockuser(user._id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white text-sm"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
          </>
        )}
      </div>
    </CombinedLayout>
  );
};

export default UserTable;