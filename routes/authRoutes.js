import  express  from "express";
import {forgotPasswordController, loginController, registerController, testControllers} from '../controllers/authController.js'
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

export  default router ; 




