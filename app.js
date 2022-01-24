require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const productsRouter = require('./routes/products');
const mongoose = require('mongoose');

//middleware
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products" style="text-decoration: none; color: #c44d56">Products Routes</a>')
});

app.use('/api/v1/products', productsRouter);

//products route
app.use(notFoundMiddleware);
app.use(errorMiddleware);


//connect_db
const connectDB = (url) => {
    return mongoose.connect(url)
};

//connection
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error);
    }
};

start();