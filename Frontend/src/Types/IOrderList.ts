export interface IOrderProduct {
  productId: string;
  productDetails: {
    category: string;
    productName: string;
    price: number;
    quantity: number;
  };
  cartQuantity: number;
  _id: string;
}

export interface IUserInfo {
  _id: string;
  userId:string;
  name: string;
  email: string;
  city: string;
  address:string;
  profilepic:string;
  phone: string;
}

export interface IOrderItem {
  _id: string;
  orderDate: string; 
  orderMethod: string;
  orderStatus: string;
  paymentStatus: string;
  selectedPaymentMethod: string;
  totalAmount: number;
  products: IOrderProduct[];
  user: IUserInfo;
}

export type IOrderResponse = IOrderItem[];
