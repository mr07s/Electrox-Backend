import  express  from "express";
import {forgotPasswordController, loginController, registerController, testControllers,updateProfileController,getOrdersController,getAllOrdersController,orderStatusUpdateController} from '../controllers/authController.js'
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";



//router object
const router =express.Router();

//REGISTER || MERHOD POST
//Because we are following nvc pattern so we have to create seperate router 
router.post('/register',registerController)
// LOGIN || POST
router.post('/login',loginController)

//forgot password || Post
router.post('/forgot_password',forgotPasswordController)



//Test
router.get('/test',requiredSignIn, isAdmin ,  testControllers);

//protected route
router.get("/user-auth",requiredSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})
//protected admin route
router.get("/admin-auth",requiredSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//Update Profile

router.put('/profile',requiredSignIn,updateProfileController)

//Oders 
router.get('/orders',requiredSignIn,getOrdersController)
//AllOders 
router.get('/all-orders',requiredSignIn,isAdmin,getAllOrdersController)

//Order Status Update
router.put('/order-status/:orderId',requiredSignIn,isAdmin,orderStatusUpdateController)
export  default router ; 




