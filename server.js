import express from 'express'
import colors  from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'


//config env
dotenv.config();

//database config
connectDB();


//rest object
const app=express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/products',productRoutes);



//rest api
app.get('/',(req,res)=>{
res.send({
    message:'Welcome to ecommerce app'
})


})

const PORT =process.env.PORT || 8080;
app.listen(PORT,()=>{
console.log(`Server running on ${PORT} `.bgCyan.white);

})


