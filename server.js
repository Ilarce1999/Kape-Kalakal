import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';


// routers
import drinkRouter from './routes/drinkRouter.js';
if(process.env.NODE_ENV=== 'development') {
    app.use(morgan('dev'));
}

//Drinks Array
{/* let drinks = [
    {id:nanoid(), drinkName:'cappucino', size:'large', price:'140'},
    {id:nanoid(), drinkName:'espresso', size:'medium', price:'120'}
]; */}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', (req, res) => {
  console.log(req);
  res.json({message: 'data received', data: req.body});
});

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

app.use('/api/v1/drinks', drinkRouter)

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found'}); 
    
});

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

