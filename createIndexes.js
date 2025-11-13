import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './src/db/mongoDB.js';
import Activities from './src/db/models/Activities.js';

dotenv.config();

async function createIndexes() {
    try {
        // Esperar a que la conexión esté lista
        await new Promise((resolve) => {
            if (mongoose.connection.readyState === 1) {
                resolve();
            } else {
                mongoose.connection.once('open', resolve);
            }
        });

        console.log('✓ Conectado a MongoDB');
        console.log('\n🔨 Creando índices para la colección Activities...\n');

        // Verificar si los índices ya existen
        const existingIndexes = await Activities.collection.indexes();
        console.log('Índices existentes antes de crear:');
        existingIndexes.forEach((index) => {
            console.log(`  - ${index.name}`);
        });

        // Índice 1: user_id + date (para consultas básicas por usuario y fecha)
        console.log('\nCreando índice 1: user_id + date...');
        try {
            await Activities.collection.createIndex(
                { user_id: 1, date: -1 },
                {
                    name: 'user_date_idx',
                    background: true, // No bloquea la DB mientras se crea
                }
            );
            console.log('✓ Índice user_date_idx creado exitosamente');
        } catch (error) {
            if (
                error.code === 85 ||
                error.codeName === 'IndexOptionsConflict' ||
                error.message.includes('already exists')
            ) {
                console.log('⚠ Índice user_date_idx ya existe');
            } else {
                throw error;
            }
        }

        // Índice 2: user_id + activity_type + date (para filtros por tipo de actividad)
        console.log('\nCreando índice 2: user_id + activity_type + date...');
        try {
            await Activities.collection.createIndex(
                { user_id: 1, activity_type: 1, date: -1 },
                {
                    name: 'user_type_date_idx',
                    background: true,
                }
            );
            console.log('✓ Índice user_type_date_idx creado exitosamente');
        } catch (error) {
            if (
                error.code === 85 ||
                error.codeName === 'IndexOptionsConflict' ||
                error.message.includes('already exists')
            ) {
                console.log('⚠ Índice user_type_date_idx ya existe');
            } else {
                throw error;
            }
        }

        // Índice 3: user_id + date + activity_type (alternativo para diferentes patrones de consulta)
        console.log('\nCreando índice 3: user_id + date + activity_type...');
        try {
            await Activities.collection.createIndex(
                { user_id: 1, date: -1, activity_type: 1 },
                {
                    name: 'user_date_type_idx',
                    background: true,
                }
            );
            console.log('✓ Índice user_date_type_idx creado exitosamente');
        } catch (error) {
            if (
                error.code === 85 ||
                error.codeName === 'IndexOptionsConflict' ||
                error.message.includes('already exists')
            ) {
                console.log('⚠ Índice user_date_type_idx ya existe');
            } else {
                throw error;
            }
        }

        // Listar todos los índices después de crearlos
        console.log('\n📋 Índices finales en la colección:');
        const finalIndexes = await Activities.collection.indexes();
        finalIndexes.forEach((index) => {
            const keys = Object.entries(index.key)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            console.log(`  - ${index.name}: { ${keys} }`);
        });

        // Obtener estadísticas de la colección
        const stats = await mongoose.connection.db.command({
            collStats: Activities.collection.name,
        });
        console.log('\n📊 Estadísticas de la colección:');
        console.log(`  - Total de documentos: ${stats.count}`);
        console.log(
            `  - Tamaño total: ${(stats.size / 1024 / 1024).toFixed(2)} MB`
        );
        console.log(
            `  - Tamaño de índices: ${(
                stats.totalIndexSize /
                1024 /
                1024
            ).toFixed(2)} MB`
        );

        console.log('\n✅ ¡Índices creados exitosamente! 🎉');
        console.log('\n💡 Tus consultas ahora serán mucho más rápidas.\n');
    } catch (error) {
        console.error('\n❌ Error creando índices:', error);
        console.error('Detalles del error:', error.message);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('✓ Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar el script
createIndexes();
