import { useEffect, useState } from 'react';
import { Building, User, FileText, Phone, Mail, Download, Printer } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../../Api/userApiCalls/productApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

// Create a modified interface for the flat structure
interface IOrderHistoryItem {
  id: string;
  userId: string;
  cartId: string;
  productId: string;
  category: string;
  productName: string;
  price: number;
  quantity: number;
  cartQuantity: number;
  totalAmount: number;
  orderStatus: string;
  selectedPaymentMethod: string;
  paymentStatus: string;
  orderDate: Date | string;
  hotelId: string;
  hotelName: string;
  hotelProfilePic: string;
  hotelEmail: string;
  hotelCity: string;
  hotelLocation: string;
  hotelPhone: string;
  
paypalOrderId:string
}

const InvoiceComponent = () => {
  const { orderId } = useParams();
  const [orderItems, setOrderItems] = useState<IOrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.userProfile);

  const handleGetOrderDetails = async (orderId: string) => {
    console.log(orderId, 'THIS IS ORDER ID');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchOrderDetails(orderId);
      // Assuming the API returns an array of order items
      setOrderItems(response.orderDetails);
      console.log(response.orderDetails, 'THIS IS RESPONSE OF ORDER DETAILS');
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      handleGetOrderDetails(orderId);
    }
  }, [orderId]);

  // Group items by order ID if needed, or use the first item for order info
  const order = orderItems.length > 0 ? {
    id: orderItems[0].id,
    userId: orderItems[0].userId,
    cartId: orderItems[0].cartId,
    totalAmount: orderItems[0].totalAmount,
    orderStatus: orderItems[0].orderStatus,
    selectedPaymentMethod: orderItems[0].selectedPaymentMethod,
    paymentStatus: orderItems[0].paymentStatus,
    orderDate: orderItems[0].orderDate,
    hotelId: orderItems[0].hotelId,
    hotelName: orderItems[0].hotelName,
    hotelProfilePic: orderItems[0].hotelProfilePic,
    hotelEmail: orderItems[0].hotelEmail,
    hotelCity: orderItems[0].hotelCity,
    hotelLocation: orderItems[0].hotelLocation,
    hotelPhone: orderItems[0].hotelPhone,
    
paypalOrderId : orderItems[0].paypalOrderId,
    invoiceNumber: `INV-${orderItems[0].cartId || orderId}`,
    products: orderItems.map(item => ({
      productId: item.productId,
      category: item.category,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      cartQuantity: item.cartQuantity,
    }))
  } : null;

  // Mock customer data - Replace with actual customer data from your API
  const customer = {
    name: user.name,
    address: user.address,
    city: user.city,
    phone: user.phone
  };

  // Format date function with error handling
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Calculate subtotal safely
  const calculateSubtotal = () => {
    if (!order?.products) return 0;
    return order.products.reduce((total, product) => {
      return total + (product.price * product.cartQuantity);
    }, 0);
  };

  // Calculate tax (8%)
  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  // Calculate delivery fee
  const deliveryFee = 3.99;

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download with proper error handling
  const handleDownload = async () => {
    if (!order) {
      alert('No order data available for download');
      return;
    }

    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = subtotal + tax + deliveryFee;

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${order.invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #374151;
              background-color: #f9fafb;
            }
            
            .invoice-container {
              background-color: white;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
              overflow: hidden;
              max-width: 1000px;
              margin: 0 auto;
              padding: 2rem;
            }
            
            .invoice-header {
              text-align: center;
              margin-bottom: 2rem;
            }
            
            .invoice-header h1 {
              font-size: 1.875rem;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 0.5rem;
            }
            
            .invoice-header h2 {
              font-size: 1.125rem;
              color: #ea580c;
              font-weight: 600;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1.5rem;
              margin-bottom: 2rem;
            }
            
            .info-box {
              background-color: #fffbeb;
              padding: 1rem;
              border-radius: 0.5rem;
            }
            
            .info-box h4 {
              font-size: 0.875rem;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 0.75rem;
            }
            
            .info-box p {
              font-size: 0.875rem;
              color: #4b5563;
              margin: 0.25rem 0;
            }
            
            .highlight {
              font-weight: 500;
              color: #9a3412;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 2rem;
            }
            
            .items-table th {
              background-color: #ea580c;
              color: white;
              padding: 0.75rem 1rem;
              text-align: left;
              font-weight: 600;
            }
            
            .items-table td {
              padding: 0.75rem 1rem;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .items-table tr:nth-child(even) {
              background-color: #fffbeb;
            }
            
            .totals-box {
              width: 20rem;
              background-color: #fffbeb;
              border-radius: 0.5rem;
              padding: 1.5rem;
              margin-left: auto;
              margin-bottom: 2rem;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.75rem;
              font-size: 0.875rem;
            }
            
            .total-row {
              border-top: 1px solid #ea580c;
              padding-top: 0.75rem;
              font-weight: bold;
              font-size: 1.125rem;
            }
            
            .thank-you {
              text-align: center;
              color: #ea580c;
              font-weight: 600;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>INVOICE</h1>
              <h2>${order.invoiceNumber}</h2>
            </div>
            
            <div class="info-grid">
              <div class="info-box">
                <h4>From</h4>
                <p class="highlight">${order.hotelName || 'N/A'}</p>
                <p>${order.hotelCity || 'N/A'}</p>
                <p>${order.hotelPhone || 'N/A'}</p>
                <p>${order.hotelEmail || 'N/A'}</p>
              </div>
              
              <div class="info-box">
                <h4>Bill To</h4>
                <p class="highlight">${customer.name}</p>
                <p>${customer.address}</p>
                <p>${customer.city}</p>
                <p>${customer.phone}</p>
              </div>
              
              <div class="info-box">
                <h4>Invoice Details</h4>
                <p><span class="highlight">Invoice #:</span> ${order.paypalOrderId}</p>
                <p><span class="highlight">Date:</span> ${formatDate(order.orderDate as string)}</p>
                <p><span class="highlight">Payment:</span> ${order.selectedPaymentMethod || 'N/A'}</p>
                <p><span class="highlight">Status:</span> ${order.orderStatus || 'N/A'}</p>
              </div>
            </div>
            
            <h4 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem;">Order Items</h4>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.products.map(product => `
                  <tr>
                    <td>
                      <div style="font-weight: 500; color: #1f2937;">${product.productName || 'N/A'}</div>
                      <div style="font-size: 0.875rem; color: #ea580c;">${product.category || 'N/A'}</div>
                    </td>
                    <td style="text-align: center;">${product.cartQuantity || 0}</td>
                    <td style="text-align: right;">$${(product.price || 0).toFixed(2)}</td>
                    <td style="text-align: right; font-weight: 500; color: #9a3412;">
                      $${((product.price || 0) * (product.cartQuantity || 0)).toFixed(2)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>Tax (8%):</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>Delivery Fee:</span>
                <span>$${deliveryFee.toFixed(2)}</span>
              </div>
              <div class="totals-row total-row">
                <span>Total:</span>
                <span style="color: #ea580c;">$${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="thank-you">
              <p>Thank you for your order!</p>
              <p style="font-size: 0.875rem; color: #4b5563; margin-top: 0.25rem;">
                Your invoice has been generated and will be emailed to you.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.invoiceNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        alert('Invoice downloaded as HTML file. You can open it and print to PDF using your browser (Ctrl+P → Save as PDF)');
      }, 500);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading invoice...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Invoice</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => orderId && handleGetOrderDetails(orderId)}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No order data state
  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Order Data</h2>
          <p className="text-gray-600">Unable to load order details for this invoice.</p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div id="invoice-content" className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto">
        <div className="p-8">
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mb-8 print:hidden">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-white text-orange-600 border border-orange-300 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>

          {/* Invoice Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
            <p className="text-lg text-orange-600 font-semibold">{order.paypalOrderId}</p>
          </div>

          {/* Invoice Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2 text-orange-500" />
                From
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-orange-800">{order.hotelName || 'N/A'}</p>
                <p>{order.hotelCity || 'N/A'}</p>
                <p className="flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-orange-500" />
                  {order.hotelPhone || 'N/A'}
                </p>
                <p className="flex items-center">
                  <Mail className="w-3 h-3 mr-1 text-orange-500" />
                  {order.hotelEmail || 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                Bill To
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-orange-800">{customer.name}</p>
                <p>{customer.address}</p>
                <p>{customer.city}</p>
                <p>{customer.phone}</p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Invoice Details
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Invoice #:</span> {order.paypalOrderId}</p>
                <p><span className="font-medium">Date:</span> {formatDate(order.orderDate as string)}</p>
                <p><span className="font-medium">Payment:</span> {order.selectedPaymentMethod || 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {order.orderStatus || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-center py-3 px-4 font-semibold">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, index) => (
                    <tr
                      key={product.productId}
                      className={index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{product.productName || 'N/A'}</p>
                          <p className="text-sm text-orange-600">{product.category || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{product.cartQuantity || 0}</td>
                      <td className="py-3 px-4 text-right">${(product.price || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-medium text-orange-700">
                        ${((product.price || 0) * (product.cartQuantity || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 bg-orange-50 rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-orange-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-orange-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center">
            <p className="text-orange-500 font-semibold">Thank you for your order!</p>
            <p className="text-gray-600 text-sm mt-1">
              Your invoice has been generated and will be emailed to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;