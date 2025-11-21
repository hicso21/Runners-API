import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const url = process.env.MONGODB_URI;

// CONFIGURACIÓN OPTIMIZADA PARA PRODUCCIÓN
const mongooseOptions = {
    dbName: 'runners_api',
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const db = mongoose
    .connect(url, mongooseOptions)
    .then(() => {
        console.log('✅ DB connected successfully with production settings');
    })
    .catch((err) => console.error('❌ DB connection error:', err));

mongoose.Promise = global.Promise;

// MANEJAR ERRORES DE CONEXIÓN
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

export default db;
