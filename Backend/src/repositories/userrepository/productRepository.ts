import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";
import { IProductRepository } from "../../interfaces/user/products/IProductRepository";
import Product, { IProducts, IProductsDetails } from "../../models/hotelModel/productModel";
import Cart, { ICart } from "../../models/usermodel/cartModel";
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
            throw new Error(Messages.PRODUCT_NOT_FOUND);
        }
        const productDetails = product.productDetails.find(
            (p) => p._id.toString() === productId
        );
        if (!productDetails) {
            throw new Error(Messages.PRODUCT_NOT_FOUND);
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                products: [
                    {
                        productId: productDetails._id,
                        productDetails,
                        quantity: 1
                    }
                ]
            });
        } else {

            let existingProduct = cart.products.find(p => p.productId.toString() === productId);
            if (existingProduct) {
                // existingProduct.quantity += 1;
            } else {
                cart.products.push({
                    productId: productDetails._id as unknown as mongoose.Types.ObjectId,
                    productDetails,
                    quantity: 1
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
        if (!cart) throw createHttpError(400, "Cart not found");

        const cartProduct = cart.products.find(p => p.productId.toString() === productId);
        if (!cartProduct) throw createHttpError(400, "Product not in cart");

        let updatedQuantity = cartProduct.quantity;

        if (action === "increment") {
            // Just increment the cart quantity
            updatedQuantity += 1;
        } else if (action === "decrement") {
            if (cartProduct.quantity <= 1) {
                throw createHttpError(400, "Quantity cannot be less than 1");
            }
            updatedQuantity -= 1;
        }

        // Update the cart only, not the product stock
        await Cart.updateOne(
            { userId, "products.productId": productId },
            { $set: { "products.$.quantity": updatedQuantity } }
        );

        return { updatedQuantity };
    }


    async getCheckOut(userId: string): Promise<ICart | null> {
        return await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("products");
    }

    async createOrder(userId: string): Promise<void> {

    }
}
