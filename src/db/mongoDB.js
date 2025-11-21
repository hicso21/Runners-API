import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const url = process.env.MONGODB_URI;

const mongooseOptions = {
    dbName: 'runners_api',
    maxPoolSize: 10, // Conexiones máximas
    minPoolSize: 5, // Conexiones mínimas
    socketTimeoutMS: 45000, // Timeout de sockets
    family: 4, // Usar IPv4
    serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
    heartbeatFrequencyMS: 10000, // Frecuencia de heartbeat
};

const db = mongoose
    .connect(url, mongooseOptions)
    .then(() => {
        console.log('✅ DB was connected successfully with optimized settings');

        // Verificar índices después de conectar
        setTimeout(() => {
            checkAndCreateIndexes();
        }, 2000);
    })
    .catch((err) => console.error('❌ DB connection error:', err));

mongoose.Promise = global.Promise;

// FUNCIÓN PARA VERIFICAR Y CREAR ÍNDICES
async function checkAndCreateIndexes() {
    try {
        console.log('🔧 Checking database indexes...');

        const db = mongoose.connection.db;
        const collection = db.collection('activities');

        // Verificar índices existentes
        const existingIndexes = await collection.indexes();
        console.log(
            '📊 Existing indexes:',
            existingIndexes.map((idx) => idx.name)
        );

        // Crear índices esenciales si no existen
        const requiredIndexes = [
            {
                keys: { user_id: 1, timestamp_num: -1 },
                options: { name: 'idx_main_query', background: true },
            },
        ];

        for (const index of requiredIndexes) {
            const exists = existingIndexes.some(
                (idx) => JSON.stringify(idx.key) === JSON.stringify(index.keys)
            );

            if (!exists) {
                console.log(`Creating index: ${index.options.name}`);
                await collection.createIndex(index.keys, index.options);
            }
        }

        console.log('✅ Index verification completed');
    } catch (error) {
        console.log('⚠️ Index check skipped:', error.message);
    }
}

export default db;
