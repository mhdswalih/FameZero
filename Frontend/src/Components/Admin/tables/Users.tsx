import { FaUserCircle, FaBan, FaEllipsisH } from 'react-icons/fa';
import CombinedLayout from '../sidesheet/AdminSideSheet';
import { fetchUser } from '../../../Api/adminApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../Components/ui/Loader'; 

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  status: 'active' | 'blocked'; 
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUser();
      setUsers(response.data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch users');
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, currentStatus: 'active' | 'blocked') => {
    try {
    
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      toast.promise(
     
        new Promise((resolve) => {
          setTimeout(() => {
            setUsers(users.map(user => 
              user.id === userId ? { ...user, status: newStatus } : user
            ));
            resolve('success');
          }, 500);
        }),
        {
          loading: 'Updating user status...',
          success: `User ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`,
          error: 'Failed to update user status',
        }
      );
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) return <CombinedLayout><LoadingSpinner /></CombinedLayout>;
  if (error) return <CombinedLayout><div className="text-red-500 p-4">{error}</div></CombinedLayout>;

  return (
    <CombinedLayout>
      <div className="overflow-x-auto rounded-lg border border-orange-400 shadow-sm">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No users found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            {/* Table Header */}
            <thead className="bg-black">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  User
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
            <tbody className="bg-black divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatar} 
                            alt={user.name} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <FaUserCircle className="h-10 w-10 text-orange-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.phone}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleStatusChange(user.id, user.status)}
                        className={`p-2 rounded-full ${
                          user.status === 'active' 
                            ? 'text-red-400 hover:bg-red-900' 
                            : 'text-green-400 hover:bg-green-900'
                        }`}
                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        <FaBan />
                      </button>
                      <button
                        className="p-2 rounded-full text-orange-400 hover:bg-orange-900"
                        title="User Details"
                      >
                        <FaEllipsisH />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CombinedLayout>
  );
};

export default UserTable;