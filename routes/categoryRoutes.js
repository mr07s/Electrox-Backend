import express from 'express'
import { deletecategoryController,createCategoryController, updateCategoryController ,getcategoryController, singlecategoryController} from '../controllers/createCategoryController.js';
import { requiredSignIn,isAdmin } from '../middlewares/authMiddleware.js';

const router =express.Router();

// routes
//Create Category
router.post('/create-category',requiredSignIn,isAdmin ,createCategoryController)

// Update Category
router.put('/update-category/:id',requiredSignIn,isAdmin,updateCategoryController)

//get all category
router.get('/get-category',getcategoryController)

//get single category
router.get('/single-category/:slug',singlecategoryController)
//delete category
router.delete('/delete-category/:id',requiredSignIn,isAdmin,deletecategoryController)





export default router;
