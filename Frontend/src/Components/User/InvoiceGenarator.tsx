import React from 'react';
import { Building, User, FileText, Phone, Mail, Download, Printer } from 'lucide-react';

const InvoiceComponent = () => {
  // All data is contained within the component
  const order = {
    hotelName: 'Delicious Restaurant',
    hotelCity: 'New York',
    hotelPhone: '(555) 123-4567',
    hotelEmail: 'info@deliciousrestaurant.com',
    invoiceNumber: 'INV-2023-001',
    orderDate: '2023-11-15',
    selectedPaymentMethod: 'Credit Card',
    orderStatus: 'Completed',
    products: [
      {
        productId: 'prod-1',
        productName: 'Margherita Pizza',
        category: 'Main Course',
        price: 12.99,
        quantity: 2
      },
      {
        productId: 'prod-2',
        productName: 'Caesar Salad',
        category: 'Appetizer',
        price: 8.99,
        quantity: 1
      },
      {
        productId: 'prod-3',
        productName: 'Garlic Bread',
        category: 'Side',
        price: 4.99,
        quantity: 1
      },
      {
        productId: 'prod-4',
        productName: 'Soft Drink',
        category: 'Beverage',
        price: 2.49,
        quantity: 3
      }
    ]
  };

  // Customer information
  const customer = {
    name: 'John Doe',
    address: '123 Main Street',
    city: 'New York, NY 10001',
    email: 'john.doe@email.com'
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return order.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
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

  // Handle download - Working PDF generation
  const handleDownload = async () => {
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = subtotal + tax + deliveryFee;

      // Create a simple HTML string of the invoice with matching styles
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
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              border: 1px solid #e5e7eb;
              overflow: hidden;
              max-width: 1000px;
              margin: 0 auto;
              padding: 2rem;
            }
            
            .action-buttons {
              display: flex;
              justify-content: flex-end;
              gap: 0.75rem;
              margin-bottom: 2rem;
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
              grid-template-columns: repeat(3, 1fr);
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
              display: flex;
              align-items: center;
            }
            
            .info-box p {
              font-size: 0.875rem;
              color: #4b5563;
              margin: 0.25rem 0;
            }
            
            .info-box .icon {
              width: 1rem;
              height: 1rem;
              margin-right: 0.5rem;
              color: #ea580c;
            }
            
            .info-box .highlight {
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
            
            .thank-you p:last-child {
              font-size: 0.875rem;
              color: #4b5563;
              margin-top: 0.25rem;
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
                <h4>
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  From
                </h4>
                <p class="highlight">${order.hotelName}</p>
                <p>${order.hotelCity}</p>
                <p>
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  ${order.hotelPhone}
                </p>
                <p>
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  ${order.hotelEmail}
                </p>
              </div>
              
              <div class="info-box">
                <h4>
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Bill To
                </h4>
                <p class="highlight">${customer.name}</p>
                <p>${customer.address}</p>
                <p>${customer.city}</p>
                <p>${customer.email}</p>
              </div>
              
              <div class="info-box">
                <h4>
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Invoice Details
                </h4>
                <p><span class="highlight">Invoice #:</span> ${order.invoiceNumber}</p>
                <p><span class="highlight">Date:</span> ${formatDate(order.orderDate)}</p>
                <p><span class="highlight">Payment:</span> ${order.selectedPaymentMethod}</p>
                <p><span class="highlight">Status:</span> ${order.orderStatus}</p>
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
                      <div style="font-weight: 500; color: #1f2937;">${product.productName}</div>
                      <div style="font-size: 0.875rem; color: #ea580c;">${product.category}</div>
                    </td>
                    <td style="text-align: center;">${product.quantity}</td>
                    <td style="text-align: right;">$${product.price.toFixed(2)}</td>
                    <td style="text-align: right; font-weight: 500; color: #9a3412;">
                      $${(product.price * product.quantity).toFixed(2)}
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
              <p>Your invoice has been generated and will be emailed to you.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Create a blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.invoiceNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Also show a message about converting to PDF
      setTimeout(() => {
        alert('Invoice downloaded as HTML file. You can open it and print to PDF using your browser (Ctrl+P → Save as PDF)');
      }, 500);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice');
    }
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = subtotal + tax + deliveryFee;

  return (
    <div id="invoice-content" className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-screen mx-auto">
      <div className="p-8">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mb-8 print-hide">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
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
          <p className="text-lg text-orange-600 font-semibold">{order.invoiceNumber}</p>
        </div>

        {/* Invoice Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2 text-orange-500" />
              From
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-orange-800">{order.hotelName}</p>
              <p>{order.hotelCity}</p>
              <p className="flex items-center">
                <Phone className="w-3 h-3 mr-1 text-orange-500" />
                {order.hotelPhone}
              </p>
              <p className="flex items-center">
                <Mail className="w-3 h-3 mr-1 text-orange-500" />
                {order.hotelEmail}
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
              <p>{customer.email}</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-orange-500" />
              Invoice Details
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Invoice #:</span> {order.invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {formatDate(order.orderDate)}</p>
              <p><span className="font-medium">Payment:</span> {order.selectedPaymentMethod}</p>
              <p><span className="font-medium">Status:</span> {order.orderStatus}</p>
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
                        <p className="font-medium text-gray-800">{product.productName}</p>
                        <p className="text-sm text-orange-600">{product.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{product.quantity}</td>
                    <td className="py-3 px-4 text-right">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium text-orange-700">
                      ${(product.price * product.quantity).toFixed(2)}
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
  );
};

export default InvoiceComponent;