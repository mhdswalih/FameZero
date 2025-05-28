import  express ,{ Request,Response }from 'express';
import userRouter from './routers/userRouters/userRoute'
import cors from 'cors';
import './config/redisService';
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import { errorHandler } from './middleware/erorrMiddleware';
dotenv.config()

const app = express()

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials : true

}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))



app.use('/api',userRouter)

app.use(errorHandler)

connectDB().then(() => {
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
