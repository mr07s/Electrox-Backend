import express from 'express'
import { createProductController, getProductController,getSingleProductController,productPhotoController ,deleteProductController,updateProductController,productFiltersController,productCountController,productListController,searchProductController, ralatedProductController,productCategoryController} from '../controllers/productController.js';
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js';
import formidable from "express-formidable";




const router =express.Router();

//Create Products
router.post('/create-product',requiredSignIn,isAdmin,formidable(),createProductController)
// Update Products
router.put('/update-product/:pid',requiredSignIn,isAdmin,formidable(),updateProductController)

// Get products
router.get('/get-product',getProductController)
// Get  single product
router.get('/get-product/:slug',getSingleProductController)
// Get  photo
router.get('/product-photo/:pid',productPhotoController)
// dalet  photo
router.delete('/delete-product/:pid',deleteProductController)
//filter product
router.post('/product-filters',productFiltersController)

// product Count
router.get('/product-count',productCountController)
//Product per page
router.get('/product-list/:page',productListController);
//Search controller
router.get('/search/:keyword',searchProductController);
//Similar Products
router.get('/related-product/:pid/:cid',ralatedProductController)
//CategoryWise Products
router.get('/product-category/:slug',productCategoryController)

export default router