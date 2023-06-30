import  express  from "express";
import {loginController, registerController, testControllers} from '../controllers/authController.js'
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";



//router object
const router =express.Router();

//REGISTER || MERHOD POST
//Because we are following nvc pattern so we have to create seperate router 
router.post('/register',registerController)
// LOGIN || POST
router.post('/login',loginController)
//Test
router.get('/test',requiredSignIn, isAdmin ,  testControllers);


export  default router ; 




