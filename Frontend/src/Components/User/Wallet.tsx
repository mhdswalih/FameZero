import { useEffect, useState } from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import UserCombinedLayout from '../UserNav&Footer/SideBar';
import { getWalletBalance } from '../../Api/userApiCalls/profileApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

interface IWallet {
  _id: string;
  userId: string;
  productId: string;
  hotelId: string;
  totalAmount: number;
}

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [wallets, setWallets] = useState<IWallet[]>([]);

  const userId = useSelector((state: RootState) => state.user.id);

const handleGetBalance = async () => {
  try {
    const response = await getWalletBalance(userId);
    console.log(response, 'WALLET RESPONSE');
    setWallets(Array.isArray(response) ? response : [response]);
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    setWallets([]);
  }
};


  useEffect(() => {
    handleGetBalance();
  }, []);

  return (
    <UserCombinedLayout>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

            {/* Total Balance (Sum of all wallets) */}
            <div className="bg-black rounded-xl p-8 text-white">
              <p className="text-orange-300 mb-2 text-sm font-semibold">
                Total Balance
              </p>
              <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold">$
                  {showBalance
                    ? `${(wallets).reduce((acc, w) => acc + w.totalAmount, 0)}`
                    : '••••••'}

                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-3 hover:bg-gray-800 rounded-full transition"
                >
                  {showBalance ? <Eye size={28} /> : <EyeOff size={28} />}
                </button>
              </div>
            </div>

            {/* Add Money Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Plus size={24} />
              Add Money
            </button>
          </div>
        </div>

        {/* Wallet List Section */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h3 className="text-2xl font-bold mb-6 text-black">
            Wallet Details
          </h3>

          {wallets.length === 0 ? (
            <p className="text-gray-600 text-center">No wallet found.</p>
          ) : (
            <div className="space-y-4">
              {wallets.map((w) => (
                <div
                  key={w._id}
                  className="p-5 bg-gray-100 rounded-lg shadow-sm border-l-4 border-orange-500 hover:bg-gray-200 transition"
                >
                  <p className="text-lg font-semibold text-black">
                    💰 Amount: <span className="text-orange-600">{w.totalAmount}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Money Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <h2 className="text-2xl font-bold text-black mb-6">Add Money</h2>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-3 border-2 border-orange-500 rounded-lg text-black text-lg mb-6 focus:outline-none focus:border-orange-600"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserCombinedLayout>
  );
};

export default Wallet;
