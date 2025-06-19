import React from 'react';
import { FaUserCircle, FaBan, FaEllipsisH } from 'react-icons/fa';
import CombinedLayout from '../sidesheet/AdminSideSheet';

const HotelsTable = () => {
  // Sample user data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1 234 567 890',
      status: 'active',
      avatar: null
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '+1 987 654 321',
      status: 'active',
      avatar: null
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      mobile: '+1 555 123 4567',
      status: 'blocked',
      avatar: null
    }
  ];

  return (
    <div>
      <CombinedLayout>
    <div className="overflow-x-auto rounded-lg border border-orange-400 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
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
        <tbody className="bg-black divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-orange-50 transition-colors">
              {/* User Column with Avatar and Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.avatar ? (
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                    ) : (
                      <FaUserCircle className="h-10 w-10 text-orange-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </div>
                </div>
              </td>
              
              {/* Email Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              
              {/* Mobile Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.mobile}</div>
              </td>
              
              {/* Status Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </td>
              
              {/* Actions Column */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    className={`p-2 rounded-full ${
                      user.status === 'active' 
                        ? 'text-red-500 hover:bg-red-100' 
                        : 'text-green-500 hover:bg-green-100'
                    }`}
                    title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                  >
                    <FaBan />
                  </button>
                  <button
                    className="p-2 rounded-full text-orange-500 hover:bg-orange-100"
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
    </div>
 </CombinedLayout>
    </div>
  );
};

export default HotelsTable;