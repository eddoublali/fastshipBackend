const mongoose = require('mongoose');
require('dotenv').config(); // Charger les variables d'environnement

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, { });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Arrête le serveur en cas d'erreur
    }
};

module.exports = connectDB;

