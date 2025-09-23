export interface IOrderHistory {
  id: string;
  userId: string;
  totalAmount: number;
  orderStatus: string;
  selectedPaymentMethod: string;
  paymentStatus: string;
  orderDate: Date | string;
  hotelId: string;
  cartId:string
  hotelName: string;
  hotelProfilePic: string;
  hotelEmail: string;
  hotelCity: string;
  hotelLocation: string;
  hotelPhone: string;
  products: {
    productId: string;
    productDetails : {
      category: string;
      productName: string;
      price: number;
      quantity: number;
    }
    cartQuantity: number;
  }[];
  payPalOrderId:string
}