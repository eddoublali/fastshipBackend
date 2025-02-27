const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const { errorHandler, notFound } = require('./middlewares/errors');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: 'https://forevershop.vercel.app/' // Replace with your React app's port
  }));// Enable CORS
app.use(express.json()); // Parse JSON bodies
// Serve static files from the "public" folder
app.use("/images/products", express.static(path.join(__dirname, "public/images/products")));
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middleware
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle other errors

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is successfully running, and app is listening on port ${PORT}`);
    } else {
        console.log('Error occurred, server can\'t start', error);
    }
});
