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


export default productRoutes
