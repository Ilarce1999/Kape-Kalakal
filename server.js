import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// routers
import drinkRouter from './routes/drinkRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

if(process.env.NODE_ENV=== 'development') {
    app.use(morgan('dev'));
}

//Drinks Array
{/* let drinks = [
    {id:nanoid(), drinkName:'cappucino', size:'large', price:'140'},
    {id:nanoid(), drinkName:'espresso', size:'medium', price:'120'}
]; */}

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
    res.json({msg: 'test route'});
})

{/* app.post('/api/v1/test', 

    validateTest,
 (req, res) => {
  const { name } = req.body;

  res.json({ message: `hello ${name}`});
}); */}

{/* }
//GET ALL DRINKS
app.get('/api/v1/drinks');

//CREATE AN ORDER
app.post('/api/v1/drinks');

//GET SINGLE DRINK
app.get('/api/v1/drinks/:id');

//EDIT DRINK
app.patch('/api/v1/drinks/:id');

// DELETE DRINK
app.delete('/api/v1/drinks/:id'); */}

// Not Found Middleware (* --> To apply all the request) When a request is made to a route that does not exist. 
// It is designed to handle requests for non-existent routes.

app.use('/api/v1/drinks', authenticateUser, drinkRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found'}); 
    
});

app.use(errorHandlerMiddleware);

//Error Middleware - error middleware is a catch-all for handling unexpected errors that occur during request processing
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ msg: 'something went wrong'});
});


const port = process.env.PORT || 5100

try{
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => {
        console.log(`server running on PORT ${port}...`);
    });
}

catch(error){
    console.log(error);
    process.exit(1);
}

