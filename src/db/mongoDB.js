import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const url = process.env.MONGODB_URI;

if (!url) {
    console.error(
        '❌ MONGODB_URI no está definida en las variables de entorno'
    );
    process.exit(1);
}

// CONFIGURACIÓN OPTIMIZADA PARA PRODUCCIÓN
const mongooseOptions = {
    dbName: 'runners_api',
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000, // Aumentado a 10s
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
};

let connectionPromise = null;
let isConnected = false;

// Función para conectar
const connectDB = async () => {
    // Si ya está conectado, retornar inmediatamente
    if (isConnected && mongoose.connection.readyState === 1)
        return mongoose.connection;

    // Si ya hay una conexión en progreso, esperar a esa
    if (connectionPromise) return connectionPromise;

    connectionPromise = mongoose
        .connect(url, mongooseOptions)
        .then(() => {
            isConnected = true;
            console.log(
                '✅ DB connected successfully with production settings'
            );
            return mongoose.connection;
        })
        .catch((err) => {
            console.error('❌ DB connection error:', err);
            connectionPromise = null;
            isConnected = false;
            throw err;
        });

    return connectionPromise;
};

// MANEJAR EVENTOS DE CONEXIÓN
mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
    isConnected = false;
    connectionPromise = null;
});

mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('🔄 MongoDB reconnected');
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('👋 MongoDB disconnected due to app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        await mongoose.connection.close();
        console.log('👋 MongoDB disconnected due to SIGTERM');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

mongoose.Promise = global.Promise;

// Conectar inmediatamente
connectDB().catch((error) => {
    console.error('❌ Failed to connect to MongoDB on startup:', error);
});

// Exportar tanto la promesa como la función
export { connectDB, mongoose };
export default connectDB;
