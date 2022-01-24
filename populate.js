require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Products');
const jsonProducts = require('./products.json');

const connectDB = (url) => {
    return mongoose.connect(url)
};

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log("Success!");
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
};

start();