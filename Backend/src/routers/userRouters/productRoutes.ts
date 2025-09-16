import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { ProductRepository } from "../../repositories/userrepository/productRepository";
import { ProductService } from "../../services/user/productService";
import { ProductController } from "../../controllers/user/productContoller";



const productRoutes = Router()

const productRepository = new ProductRepository()
const productService = new ProductService(productRepository)
const productController = new ProductController(productService)


productRoutes.post('/add-to-cart/:productId/:userId/:hotelId',authenticateToken,productController.addToCart.bind(productController))
productRoutes.get('/get-cart/:userId',authenticateToken,productController.getCart.bind(productController))
productRoutes.delete('/delete-from-cart/:productId/:userId',authenticateToken,productController.removeFromCart.bind(productController))
productRoutes.put('/update-stock-item',authenticateToken,productController.updateStock.bind(productController))
productRoutes.get('/checkout/:userId',authenticateToken,productController.getCheckOut.bind(productController))
productRoutes.post('/create-order/:userId',authenticateToken,productController.createOrder.bind(productController))
productRoutes.patch('/update-payment-status/:orderId',authenticateToken,productController.updatePaymentStatus.bind(productController))
productRoutes.get('/get-order-history/:userId',authenticateToken,productController.getOrderHistory.bind(productController))
productRoutes.post('/re-pay/:orderId',authenticateToken,productController.rePayTheOrder.bind(productController))
productRoutes.post('/status-re-pay/:orderId',authenticateToken,productController.rePayUpdateStatus.bind(productController))


export default productRoutes
