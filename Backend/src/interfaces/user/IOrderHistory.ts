export interface IOrderHistory {
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
  orderDate: Date;

  // Hotel profile fields from lookup
  hotelId: string;
  hotelName: string;
  hotelEmail: string;
  hotelProfilePic: string;
  hotelIdProof: string;
  hotelStatus: string;
  hotelLocation: string;
  hotelCity: string;
  hotelPhone: string;
}
