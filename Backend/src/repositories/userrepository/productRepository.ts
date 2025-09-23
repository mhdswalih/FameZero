import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";
import { IOrderHistory } from "../../interfaces/user/IOrderHistory";
import { IProductRepository } from "../../interfaces/user/products/IProductRepository";
import hotelProfile from "../../models/hotelModel/hotelProfileModel";
import Product, { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import Cart, { ICart } from "../../models/usermodel/cartModel";
import Order, { IOrder } from "../../models/usermodel/orderModel";
import { createHttpError } from "../../utils/httperr";
import { BaseRepository } from "./baseRepository";
import mongoose from "mongoose";

export class ProductRepository extends BaseRepository<IProducts> implements IProductRepository {
    constructor() {
        super(Product);
    }
    async addToCart(productId: string, userId: string, hotelId: string): Promise<void> {
        const product = await Product.findOne({ "productDetails._id": productId });
        if (!product) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PRODUCT_NOT_FOUND);
        }

        const hotel = await hotelProfile.findOne({ userId: hotelId });
        if (!hotel) {
            throw createHttpError(HttpStatus.BAD_REQUEST, "Hotel Not found");
        }
        let cart = await Cart.findOne({ userId });
        const productDetails = product.productDetails.find(
            (p) => p._id.toString() === productId
        );
        if (!productDetails) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PRODUCT_NOT_FOUND);
        }
        if (cart) {
            if (cart.hotelId.toString() !== hotelId.toString()) {
                throw createHttpError(
                    HttpStatus.BAD_REQUEST,
                    "This cart belongs to another hotel. Please checkout or clear your cart first."
                );
            }
        }

        if (!cart) {
            cart = new Cart({
                userId,
                hotelId,
                products: [
                    {
                        productId: productDetails._id,
                        productDetails,
                        cartQuantity: 1,
                    },
                ],
            });
        } else {
            const existingProduct = cart.products.find(
                (p) => p.productId.toString() === productId
            );

            if (existingProduct) {
                throw createHttpError(HttpStatus.BAD_REQUEST, Messages.DUBLICATE_PRODUCT_IN_CART)
            } else {
                cart.products.push({
                    productId: new mongoose.Types.ObjectId(productDetails._id),
                    productDetails,
                    cartQuantity: 1,
                });
            }
        }

        await cart.save();
    }

    async getCart(userId: string): Promise<IProductsDetails[] | null> {
        return await Cart.findOne({ userId });
    }
    async removeFromCart(userId: string, productId: string): Promise<void> {
        const result = await Cart.updateOne(
            { userId },
            { $pull: { products: { productId: productId } } }
        );
        if (result.modifiedCount === 0) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PRODUCT_NOT_FOUND);
        }
    }
    async updateStockInCart(
        userId: string,
        productId: string,
        action: "increment" | "decrement"
    ): Promise<{ updatedQuantity: number }> {

        const cart = await Cart.findOne({ userId, "products.productId": productId });
        if (!cart) throw createHttpError(HttpStatus.BAD_REQUEST, "Cart not found");

        // Look inside the products array
        const cartProduct = cart.products.find(
            (p) => p.productId.toString() === productId
        );

        if (!cartProduct) throw createHttpError(HttpStatus.BAD_REQUEST, "Product not in cart");

        let updatedQuantity = cartProduct.cartQuantity;


        if (action === "increment") {
            updatedQuantity += 1;
        } else if (action === "decrement") {
            if (cartProduct.cartQuantity <= 1) {
                throw createHttpError(HttpStatus.BAD_REQUEST, "Quantity cannot be less than 1");
            }
            updatedQuantity -= 1;
        }
        await Cart.updateOne(
            { userId, "products.productId": productId },
            { $set: { "products.$.cartQuantity": updatedQuantity } }
        );

        return { updatedQuantity };
    }


    async getCheckOut(userId: string): Promise<ICart | null> {
        return await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("products");
    }
    async createOrder(
        userId: string,
        paymentMethod: "Online" | "COD",
        selectedDeliveryOption: "delivery" | "takeaway"
    ): Promise<{ totalAmount: number; orderId: string }> {
        // 1. Fetch cart
        const cart = await Cart.findOne({ userId }).lean();
        if (!cart || cart.products.length === 0) {
            throw createHttpError(HttpStatus.BAD_REQUEST, "Cart not found or empty");
        }
        let calculatedAmount = cart.products.reduce((sum, item) => {
            const price = item.productDetails?.price || 0;
            return sum + price * (item.cartQuantity || 1);
        }, 0);

        if (selectedDeliveryOption === "delivery") {
            calculatedAmount += 3.99;
        }

        const hotelId = cart.hotelId;
        const firstProductId = cart.products[0]?.productId;


        const newOrder = new Order({
            userId,
            cartId: cart._id,
            hotelId,
            productId: firstProductId,
            products: cart.products.map((p) => ({
                productId: p.productId,
                productDetails: {
                    category: p.productDetails?.category,
                    productName: p.productDetails?.productName,
                    price: p.productDetails?.price,
                    quantity: p.productDetails?.quantity,
                },
                cartQuantity: p.cartQuantity,
            })),
            totalAmount: calculatedAmount,
            selectedPaymentMethod: paymentMethod,
            orderStatus: "Pending",
            paymentStatus: "Pending",
            orderMethod: selectedDeliveryOption,
        })
        const savedOrder = await newOrder.save();
        await Cart.deleteMany({ userId });
        return {
            totalAmount: calculatedAmount,
            orderId: savedOrder._id.toString(),
        };
    }

    async updatePayementStatus(orderId: string, paymentStatus: string, paypalOrderId: string): Promise<{ paymentStatus: string } | null> {
        return await Order.findByIdAndUpdate(orderId, { paymentStatus, ...paypalOrderId && { paypalOrderId } }, { new: true })
    }
    async getOrderHistory(
        userId: string
    ): Promise<{ orderDetails: IOrderHistory[] }> {
        try {
            const orderDetails = await Order.aggregate<IOrderHistory>([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $addFields: {
                        hotelObjectId: {
                            $cond: {
                                if: { $ne: ["$hotelId", null] },
                                then: { $toObjectId: "$hotelId" },
                                else: null,
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "hotelProfile",
                        localField: "hotelObjectId",
                        foreignField: "userId",
                        as: "hotelData",
                    },
                },
                {
                    $addFields: {
                        hotel: { $arrayElemAt: ["$hotelData", 0] },
                    },
                },
                { $unwind: "$products" },
                {
                    $project: {
                        _id: { $toString: "$_id" },
                        userId: { $toString: "$userId" },
                        cartId: { $toString: "$cartId" },
                        totalAmount: 1,
                        orderStatus: 1,
                        selectedPaymentMethod: 1,
                        paymentStatus: 1,
                        orderDate: 1,
                        paypalOrderId: 1,


                        hotelId: {
                            $cond: {
                                if: { $ne: ["$hotel", null] },
                                then: { $toString: "$hotel.userId" },
                                else: { $toString: "$hotelId" },
                            },
                        },
                        hotelName: { $ifNull: ["$hotel.name", null] },
                        hotelProfilePic: { $ifNull: ["$hotel.profilepic", null] },
                        hotelEmail: { $ifNull: ["$hotel.email", null] },
                        hotelCity: { $ifNull: ["$hotel.city", null] },
                        hotelLocation: { $ifNull: ["$hotel.location", null] },
                        hotelPhone: { $ifNull: ["$hotel.phone", null] },

                        products: {
                            productId: { $toString: "$products.productId" },
                            productDetails: {
                                category: "$products.productDetails.category",
                                productName: "$products.productDetails.productName",
                                price: "$products.productDetails.price",
                                quantity: "$products.productDetails.quantity",
                            },
                            cartQuantity: "$products.cartQuantity"
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        userId: { $first: "$userId" },
                        cartId: { $first: "$cartId" },
                        totalAmount: { $first: "$totalAmount" },
                        orderStatus: { $first: "$orderStatus" },
                        selectedPaymentMethod: { $first: "$selectedPaymentMethod" },
                        paymentStatus: { $first: "$paymentStatus" },
                        orderDate: { $first: "$orderDate" },
                        payPalOrderId: { $first: "$paypalOrderId" },
                        

                        hotelId: { $first: "$hotelId" },
                        hotelName: { $first: "$hotelName" },
                        hotelProfilePic: { $first: "$hotelProfilePic" },
                        hotelEmail: { $first: "$hotelEmail" },
                        hotelCity: { $first: "$hotelCity" },
                        hotelLocation: { $first: "$hotelLocation" },
                        hotelPhone: { $first: "$hotelPhone" },

                        products: { $push: "$products" },
                    },
                },
                {
                    $sort: { orderDate: -1 },
                }
            ]);

            return { orderDetails };
        } catch (err) {
            console.error("Error fetching order history:", err);
            return { orderDetails: [] };
        }
    }
    async rePayOrder(orderId: string): Promise<{ paymentStatus: string; } | null> {
        return await Order.findById(orderId)
    }
    async rePayUpdateStatus(orderId: string, payementStatus: string): Promise<{ orderStatus: string; } | null> {
        return await Order.findByIdAndUpdate(orderId, { paymentStatus: payementStatus }, { new: true })
    }
    async getOrderDetails(orderId: string): Promise<IOrderHistory[] | null> {
        try {
            const order = await Order.aggregate<IOrderHistory>([
                { $match: { _id: new mongoose.Types.ObjectId(orderId) } },

                // Convert hotelId for lookup (if exists)
                {
                    $addFields: {
                        hotelObjectId: {
                            $cond: {
                                if: { $ne: ["$hotelId", null] },
                                then: { $toObjectId: "$hotelId" },
                                else: null,
                            },
                        },
                    },
                },

                // Lookup hotel profile
                {
                    $lookup: {
                        from: "hotelProfile",
                        localField: "hotelObjectId",
                        foreignField: "userId",
                        as: "hotelData",
                    },
                },

                // Pick only the first hotel profile
                { $addFields: { hotel: { $arrayElemAt: ["$hotelData", 0] } } },

                // Unwind products to get per-product details
                { $unwind: "$products" },

                // Project into your IOrderHistory shape
                {
                    $project: {
                        userId: { $toString: "$userId" },
                        cartId: { $toString: "$cartId" },
                        productId: { $toString: "$products.productId" },
                        category: "$products.productDetails.category",
                        productName: "$products.productDetails.productName",
                        price: "$products.productDetails.price",
                        quantity: "$products.productDetails.quantity",
                        cartQuantity: "$products.cartQuantity",
                        totalAmount: "$totalAmount",
                        orderStatus: "$orderStatus",
                        paypalOrderId :"$paypalOrderId",
                        selectedPaymentMethod: "$selectedPaymentMethod",
                        paymentStatus: "$paymentStatus",
                        orderDate: "$orderDate",

                        // Hotel profile details
                        hotelId: {
                            $cond: {
                                if: { $ne: ["$hotel", null] },
                                then: { $toString: "$hotel.userId" },
                                else: { $toString: "$hotelId" },
                            },
                        },
                        hotelName: { $ifNull: ["$hotel.name", null] },
                        hotelEmail: { $ifNull: ["$hotel.email", null] },
                        hotelProfilePic: { $ifNull: ["$hotel.profilepic", null] },
                        hotelIdProof: { $ifNull: ["$hotel.idProof", null] },
                        hotelStatus: { $ifNull: ["$hotel.status", null] },
                        hotelLocation: { $ifNull: ["$hotel.location", null] },
                        hotelCity: { $ifNull: ["$hotel.city", null] },
                        hotelPhone: { $ifNull: ["$hotel.phone", null] },
                    },
                },
            ]);

            return order.length > 0 ? order : null;
        } catch (err) {
            console.error("Error fetching order details:", err);
            return null;
        }
    }


}
