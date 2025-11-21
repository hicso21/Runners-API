import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ActivitiesServices from './src/services/v1/Activities/activities.services.js';

dotenv.config();

export async function benchmark() {
    try {
        console.log('✓ Conectado a MongoDB\n');
        console.log('🏁 Benchmark de Performance\n');

        const testUserId = '66293179a9f2428db80a6b23';
        const iterations = 5;

        // Test 1: getAllWithoutArray (últimos 7 días)
        console.log('📊 Test 1: getAllWithoutArray (últimos 7 días)');
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const times1 = [];
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            const result = await ActivitiesServices.getAllWithoutArray(
                testUserId,
                {
                    startDate: sevenDaysAgo.toISOString(),
                    limit: 7,
                }
            );
            const duration = Date.now() - start;
            times1.push(duration);
            console.log(
                `   Iteración ${i + 1}: ${duration}ms (${result.length} docs)`
            );
        }
        const avg1 = times1.reduce((a, b) => a + b, 0) / times1.length;
        console.log(`   ⏱️  Promedio: ${Math.round(avg1)}ms\n`);

        // Test 2: getAllWithoutArray (últimos 30 días)
        console.log('📊 Test 2: getAllWithoutArray (últimos 30 días)');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const times2 = [];
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            const result = await ActivitiesServices.getAllWithoutArray(
                testUserId,
                {
                    startDate: thirtyDaysAgo.toISOString(),
                    limit: 30,
                }
            );
            const duration = Date.now() - start;
            times2.push(duration);
            console.log(
                `   Iteración ${i + 1}: ${duration}ms (${result.length} docs)`
            );
        }
        const avg2 = times2.reduce((a, b) => a + b, 0) / times2.length;
        console.log(`   ⏱️  Promedio: ${Math.round(avg2)}ms\n`);

        // Test 3: getAllWithoutArray (últimos 365 días, sin límite)
        console.log('📊 Test 3: getAllWithoutArray (últimos 365 días - todos)');
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);

        const times3 = [];
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            const result = await ActivitiesServices.getAllWithoutArray(
                testUserId,
                {
                    startDate: oneYearAgo.toISOString(),
                }
            );
            const duration = Date.now() - start;
            times3.push(duration);
            console.log(
                `   Iteración ${i + 1}: ${duration}ms (${result.length} docs)`
            );
        }
        const avg3 = times3.reduce((a, b) => a + b, 0) / times3.length;
        console.log(`   ⏱️  Promedio: ${Math.round(avg3)}ms\n`);

        // Test 4: getAggregatedStats (últimos 6 meses, por semana)
        console.log('📊 Test 4: getAggregatedStats (6 meses, por semana)');
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const times4 = [];
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            const result = await ActivitiesServices.getAggregatedStats(
                testUserId,
                {
                    groupBy: 'week',
                    startDate: sixMonthsAgo.toISOString(),
                }
            );
            const duration = Date.now() - start;
            times4.push(duration);
            console.log(
                `   Iteración ${i + 1}: ${duration}ms (${
                    result.length
                } semanas)`
            );
        }
        const avg4 = times4.reduce((a, b) => a + b, 0) / times4.length;
        console.log(`   ⏱️  Promedio: ${Math.round(avg4)}ms\n`);

        // Test 5: getAggregatedStats (últimos 12 meses, por mes)
        console.log('📊 Test 5: getAggregatedStats (12 meses, por mes)');
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const times5 = [];
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            const result = await ActivitiesServices.getAggregatedStats(
                testUserId,
                {
                    groupBy: 'month',
                    startDate: twelveMonthsAgo.toISOString(),
                }
            );
            const duration = Date.now() - start;
            times5.push(duration);
            console.log(
                `   Iteración ${i + 1}: ${duration}ms (${result.length} meses)`
            );
        }
        const avg5 = times5.reduce((a, b) => a + b, 0) / times5.length;
        console.log(`   ⏱️  Promedio: ${Math.round(avg5)}ms\n`);

        // Resumen
        console.log('='.repeat(60));
        console.log('📈 RESUMEN DE PERFORMANCE');
        console.log('='.repeat(60));
        console.log(`  1. Semanal (7 días):        ${Math.round(avg1)}ms`);
        console.log(`  2. Mensual (30 días):       ${Math.round(avg2)}ms`);
        console.log(`  3. Anual (365 días):        ${Math.round(avg3)}ms`);
        console.log(`  4. Agregado semestral:      ${Math.round(avg4)}ms`);
        console.log(`  5. Agregado anual:          ${Math.round(avg5)}ms`);
        console.log('='.repeat(60));

        // Evaluación
        console.log('\n🎯 EVALUACIÓN:');
        if (avg3 < 500) {
            console.log('   ✅ EXCELENTE - Performance óptima');
        } else if (avg3 < 1000) {
            console.log('   ✅ BUENO - Performance aceptable');
        } else if (avg3 < 2000) {
            console.log(
                '   ⚠️  REGULAR - Considerar optimizaciones adicionales'
            );
        } else {
            console.log('   ❌ NECESITA MEJORA - Revisar índices y queries');
        }

        console.log('\n💡 Consejos:');
        console.log(
            '   - Si algún test supera 1000ms, considera agregar más índices'
        );
        console.log(
            '   - Usa agregación (getAggregatedStats) para períodos largos'
        );
        console.log('   - Limita resultados con pagination en el frontend\n');
    } catch (error) {
        console.error('❌ Error en benchmark:', error);
    } finally {
        console.log('✓ Finalización de benchmark');
        // await mongoose.connection.close();
        // process.exit(0);
    }
}

export async function forceFixTimestamp() {
    try {
        console.log('✓ Conectado a MongoDB\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. Verificar estado actual
        console.log('🔍 Verificando estado actual...\n');
        const total = await collection.countDocuments();
        const withTimestampNum = await collection.countDocuments({
            timestamp_num: { $exists: true, $type: 'number' },
        });

        console.log(`📊 Estado actual:`);
        console.log(`   - Total de documentos: ${total}`);
        console.log(`   - Con timestamp_num (number): ${withTimestampNum}`);
        console.log(`   - Sin timestamp_num: ${total - withTimestampNum}\n`);

        // 2. Ver un ejemplo
        const sample = await collection.findOne();
        console.log('📄 Documento de ejemplo:');
        console.log(
            `   - timestamp: "${sample.timestamp}" (${typeof sample.timestamp})`
        );
        console.log(
            `   - timestamp_num: ${
                sample.timestamp_num
            } (${typeof sample.timestamp_num})\n`
        );

        if (withTimestampNum === total) {
            console.log(
                '✅ Todos los documentos ya tienen timestamp_num correctamente\n'
            );

            // Solo verificar índices
            console.log('🔍 Verificando índices...\n');
            const indexes = await collection.indexes();
            const hasIndex = indexes.some(
                (idx) => idx.name === 'user_timestamp_num_idx'
            );

            if (!hasIndex) {
                console.log('Creando índice...');
                await collection.createIndex(
                    { user_id: 1, timestamp_num: -1 },
                    { name: 'user_timestamp_num_idx', background: true }
                );
                console.log('✓ Índice creado\n');
            } else {
                console.log('✓ Índice ya existe\n');
            }

            return;
        }

        // 3. Actualizar todos los documentos SIN timestamp_num
        console.log('🔧 Actualizando documentos...\n');

        const cursor = collection.find({
            $or: [
                { timestamp_num: { $exists: false } },
                { timestamp_num: { $type: 'string' } },
                { timestamp_num: null },
            ],
        });

        let updated = 0;
        let errors = 0;
        const batchSize = 100;
        const bulkOps = [];

        console.log('⚙️  Procesando en lotes de 100...\n');

        while (await cursor.hasNext()) {
            const doc = await cursor.next();

            let timestampNum;

            // Intentar obtener timestamp como número
            if (doc.timestamp) {
                timestampNum = parseInt(doc.timestamp);
            }

            if (!timestampNum || isNaN(timestampNum)) {
                // Si no hay timestamp válido, intentar con date
                if (doc.date) {
                    try {
                        timestampNum = new Date(doc.date).getTime();
                    } catch (e) {
                        errors++;
                        continue;
                    }
                } else {
                    errors++;
                    continue;
                }
            }

            bulkOps.push({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: { timestamp_num: timestampNum } },
                },
            });

            // Ejecutar cada 100 documentos
            if (bulkOps.length >= batchSize) {
                const result = await collection.bulkWrite(bulkOps);
                updated += result.modifiedCount;
                bulkOps.length = 0; // Limpiar array
                console.log(`   Actualizados: ${updated}...`);
            }
        }

        // Ejecutar operaciones restantes
        if (bulkOps.length > 0) {
            const result = await collection.bulkWrite(bulkOps);
            updated += result.modifiedCount;
        }

        console.log(`\n✅ Actualización completada!`);
        console.log(`   - Documentos actualizados: ${updated}`);
        console.log(`   - Errores: ${errors}\n`);

        // 4. Verificar resultado
        console.log('🔍 Verificando resultado...\n');
        const afterCount = await collection.countDocuments({
            timestamp_num: { $exists: true, $type: 'number' },
        });
        console.log(`✓ Documentos con timestamp_num: ${afterCount}/${total}\n`);

        const sampleAfter = await collection.findOne({
            timestamp_num: { $exists: true },
        });
        console.log('📄 Documento verificado:');
        console.log(`   - timestamp: "${sampleAfter.timestamp}"`);
        console.log(`   - timestamp_num: ${sampleAfter.timestamp_num}`);
        console.log(`   - Tipo: ${typeof sampleAfter.timestamp_num}\n`);

        // 5. Crear/verificar índices
        console.log('🔨 Creando índices optimizados...\n');

        const indexesToCreate = [
            {
                keys: { user_id: 1, timestamp_num: -1 },
                name: 'user_timestamp_num_idx',
            },
            {
                keys: { user_id: 1, activity_type: 1, timestamp_num: -1 },
                name: 'user_type_timestamp_num_idx',
            },
        ];

        for (const indexDef of indexesToCreate) {
            try {
                await collection.createIndex(indexDef.keys, {
                    name: indexDef.name,
                    background: true,
                });
                console.log(`✓ Índice ${indexDef.name} creado`);
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log(`⚠️  Índice ${indexDef.name} ya existe`);
                } else {
                    console.error(
                        `❌ Error creando ${indexDef.name}:`,
                        error.message
                    );
                }
            }
        }

        // 6. Listar todos los índices
        console.log('\n📋 Todos los índices:');
        const allIndexes = await collection.indexes();
        allIndexes.forEach((index) => {
            const keys = Object.entries(index.key)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            console.log(`   - ${index.name}: { ${keys} }`);
        });

        // 7. Probar una query
        console.log('\n🧪 Probando query optimizada...');
        const testUserId = '66293179a9f2428db80a6b23';
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const start = Date.now();
        const testResult = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: sevenDaysAgo.getTime() },
            })
            .sort({ timestamp_num: -1 })
            .limit(10)
            .toArray();
        const duration = Date.now() - start;

        console.log(`   - Resultados: ${testResult.length} documentos`);
        console.log(`   - Tiempo: ${duration}ms`);

        if (duration < 100) {
            console.log('   ✅ EXCELENTE - Query muy rápida\n');
        } else if (duration < 500) {
            console.log('   ✅ BUENO - Query aceptable\n');
        } else {
            console.log(
                '   ⚠️  LENTO - Los índices no se están usando correctamente\n'
            );
        }

        console.log('✅ ¡Proceso completado exitosamente!\n');
    } catch (error) {
        console.error('❌ Error:', error);
        console.error('Stack:', error.stack);
    } finally {
        console.log('✓ Finalización de forceFixTimestamp');
        // await mongoose.connection.close();
        // process.exit(0);
    }
}

export async function optimizeDatabase() {
    try {
        // Esperar a que la conexión esté lista
        await new Promise((resolve) => {
            if (mongoose.connection.readyState === 1) {
                resolve();
            } else {
                mongoose.connection.once('connected', resolve);
            }
        });

        console.log('✓ Conectado a MongoDB para optimización\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. Verificar estado actual (método corregido)
        console.log('🔍 Analizando estado actual...');
        const count = await collection.countDocuments();
        console.log(`📊 Documentos: ${count}`);

        // Obtener stats de forma compatible
        const dbStats = await mongoose.connection.db
            .admin()
            .command({ dbStats: 1 });
        console.log(
            `📊 Tamaño de BD: ${(dbStats.dataSize / 1024 / 1024).toFixed(
                2
            )} MB\n`
        );

        // 2. Listar índices actuales
        console.log('📋 Índices actuales:');
        const existingIndexes = await collection.indexes();
        existingIndexes.forEach((index, i) => {
            const keys = Object.entries(index.key)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            console.log(
                `   ${i + 1}. ${index.name || 'sin_nombre'} → { ${keys} }`
            );
        });
        console.log('');

        // 3. Crear índices compuestos optimizados
        console.log('🔧 Creando índices compuestos optimizados...');

        const optimalIndexes = [
            {
                keys: { user_id: 1, timestamp_num: -1 },
                options: {
                    name: 'user_timestamp_compuesto_idx',
                    background: true,
                },
            },
            {
                keys: { user_id: 1, activity_type: 1, timestamp_num: -1 },
                options: {
                    name: 'user_type_timestamp_compuesto_idx',
                    background: true,
                },
            },
            {
                keys: { user_id: 1, timestamp_num: -1, activity_type: 1 },
                options: {
                    name: 'user_timestamp_type_compuesto_idx',
                    background: true,
                },
            },
        ];

        let indexesCreated = 0;

        for (const index of optimalIndexes) {
            try {
                // Verificar si ya existe un índice con los mismos campos
                const exists = existingIndexes.some((existing) => {
                    const existingKeys = JSON.stringify(existing.key);
                    const newKeys = JSON.stringify(index.keys);
                    return existingKeys === newKeys;
                });

                if (!exists) {
                    await collection.createIndex(index.keys, index.options);
                    console.log(`✅ ${index.options.name} → CREADO`);
                    indexesCreated++;
                } else {
                    console.log(`⚠️  ${index.options.name} → YA EXISTE`);
                }
            } catch (error) {
                if (error.code === 85) {
                    // Índice duplicado
                    console.log(`⚠️  ${index.options.name} → DUPLICADO`);
                } else if (error.message.includes('already exists')) {
                    console.log(`⚠️  ${index.options.name} → YA EXISTE`);
                } else {
                    console.log(
                        `❌ ${index.options.name} → ERROR: ${error.message}`
                    );
                }
            }
        }

        // 4. Eliminar índices simples redundantes si es necesario
        console.log('\n🧹 Limpiando índices redundantes...');
        const redundantIndexes = ['user_id_1', 'timestamp_num_1'];

        for (const indexName of redundantIndexes) {
            try {
                // Verificar si el índice existe y no es usado por índices compuestos
                const indexExists = existingIndexes.some(
                    (idx) => idx.name === indexName
                );
                if (indexExists) {
                    console.log(
                        `ℹ️  ${indexName} → Puede ser eliminado (redundante)`
                    );
                    // Descomenta la siguiente línea si quieres eliminarlos automáticamente:
                    // await collection.dropIndex(indexName);
                    // console.log(`✅ ${indexName} → ELIMINADO`);
                }
            } catch (error) {
                console.log(
                    `⚠️  No se pudo eliminar ${indexName}: ${error.message}`
                );
            }
        }

        // 5. Probar consulta optimizada
        console.log('\n🧪 Probando consulta optimizada...');
        const testUserId = '66293179a9f2428db80a6b23';
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const startTime = Date.now();
        const testResults = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: sevenDaysAgo.getTime() },
            })
            .sort({ timestamp_num: -1 })
            .limit(10)
            .toArray();

        const queryTime = Date.now() - startTime;

        console.log(`   📊 Resultados: ${testResults.length} documentos`);
        console.log(`   ⏱️  Tiempo: ${queryTime}ms`);
        console.log(
            `   🎯 Rendimiento: ${
                queryTime < 100
                    ? '✅ EXCELENTE'
                    : queryTime < 500
                    ? '✅ BUENO'
                    : '⚠️  REGULAR'
            }`
        );

        // 6. Resumen final
        console.log('\n' + '='.repeat(50));
        console.log('📈 RESUMEN DE OPTIMIZACIÓN');
        console.log('='.repeat(50));
        console.log(`   📊 Documentos totales: ${count}`);
        console.log(`   🔧 Índices creados: ${indexesCreated}`);
        console.log(`   ⚡ Tiempo consulta: ${queryTime}ms`);
        console.log(
            `   📋 Índices totales: ${existingIndexes.length + indexesCreated}`
        );

        if (indexesCreated > 0) {
            console.log('\n✅ Optimización completada con éxito!');
            console.log(
                '🎯 Ejecuta el benchmark nuevamente para ver las mejoras'
            );
        } else {
            console.log('\nℹ️  Los índices ya estaban optimizados');
        }
    } catch (error) {
        console.error('❌ Error en optimización:', error.message);
    }
}

export async function checkCurrentIndexes() {
    try {
        await new Promise((resolve) => {
            if (mongoose.connection.readyState === 1) {
                resolve();
            } else {
                mongoose.connection.once('connected', resolve);
            }
        });

        const collection = mongoose.connection.db.collection('activities');

        console.log('🔍 Verificando índices actuales...\n');

        const indexes = await collection.indexes();

        console.log('📋 ÍNDICES EXISTENTES:');
        console.log('='.repeat(50));

        indexes.forEach((index, i) => {
            const keys = Object.entries(index.key)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            console.log(`${i + 1}. ${index.name}`);
            console.log(`   📍 Campos: { ${keys} }`);
            console.log(`   🏷️  Tipo: ${index.unique ? 'UNIQUE' : 'REGULAR'}`);
            console.log(`   📊 Tamaño: ${(index.size / 1024).toFixed(2)} KB\n`);
        });

        // Verificar si tenemos los índices necesarios
        const requiredIndexes = [
            'user_timestamp_num_idx',
            'user_type_timestamp_num_idx',
        ];

        console.log('✅ VERIFICACIÓN DE ÍNDICES REQUERIDOS:');
        requiredIndexes.forEach((indexName) => {
            const exists = indexes.some((idx) => idx.name === indexName);
            console.log(
                `   ${exists ? '✅' : '❌'} ${indexName}: ${
                    exists ? 'EXISTE' : 'FALTANTE'
                }`
            );
        });
    } catch (error) {
        console.error('❌ Error verificando índices:', error);
    }
}

export async function quickOptimize() {
    try {
        console.log('🔧 Optimización rápida de índices...\n');

        const collection = mongoose.connection.db.collection('activities');

        // Solo crear el índice más crítico
        await collection.createIndex(
            { user_id: 1, timestamp_num: -1 },
            { name: 'user_timestamp_priority_idx', background: true }
        );

        console.log('✅ Índice prioritario creado');
        console.log('🎯 Ejecuta el benchmark nuevamente para ver mejoras');
    } catch (error) {
        console.log('ℹ️  Índice ya existe o error:', error.message);
    }
}

export async function createCriticalIndexes() {
    try {
        console.log('🚀 Creando índices críticos...\n');

        const collection = mongoose.connection.db.collection('activities');

        // Solo los índices más importantes para el benchmark
        const criticalIndexes = [
            {
                keys: { user_id: 1, timestamp_num: -1 },
                options: { name: 'idx_user_timestamp', background: true },
            },
            {
                keys: { user_id: 1, activity_type: 1, timestamp_num: -1 },
                options: { name: 'idx_user_type_timestamp', background: true },
            },
        ];

        for (const index of criticalIndexes) {
            try {
                await collection.createIndex(index.keys, index.options);
                console.log(`✅ ${index.options.name} → CREADO`);
            } catch (error) {
                if (
                    error.code === 85 ||
                    error.message.includes('already exists')
                ) {
                    console.log(`⚠️  ${index.options.name} → YA EXISTE`);
                } else {
                    console.log(
                        `❌ ${index.options.name} → ERROR: ${error.message}`
                    );
                }
            }
        }

        console.log('\n✅ Índices críticos verificados/creados');
        console.log('🎯 Ahora ejecuta el benchmark para ver mejoras!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

export async function checkIndexesEnhanced() {
    try {
        const collection = mongoose.connection.db.collection('activities');

        console.log('🔍 ANÁLISIS COMPLETO DE ÍNDICES\n');

        const indexes = await collection.indexes();
        const count = await collection.countDocuments();

        console.log(`📊 Documentos en colección: ${count}`);
        console.log(`📋 Total de índices: ${indexes.length}\n`);

        console.log('🎯 ÍNDICES ACTUALES:');
        console.log('-'.repeat(60));

        indexes.forEach((index, i) => {
            const keys = Object.entries(index.key)
                .map(([key, value]) => `\x1b[36m${key}\x1b[0m: ${value}`) // Color cyan para nombres
                .join(', ');

            const isCompound = Object.keys(index.key).length > 1;
            const status = isCompound ? '🔷 COMPUESTO' : '🔸 SIMPLE';

            console.log(
                `${i + 1}. \x1b[33m${index.name || 'sin_nombre'}\x1b[0m`
            );
            console.log(`   📍 Campos: { ${keys} }`);
            console.log(`   🏷️  Tipo: ${status}`);
            console.log('');
        });

        // Verificar índices recomendados
        console.log('✅ VERIFICACIÓN DE ÍNDICES RECOMENDADOS:');
        console.log('-'.repeat(60));

        const recommendedIndexes = [
            {
                name: 'idx_user_timestamp',
                fields: ['user_id', 'timestamp_num'],
                critical: true,
            },
            {
                name: 'idx_user_type_timestamp',
                fields: ['user_id', 'activity_type', 'timestamp_num'],
                critical: false,
            },
        ];

        let optimalCount = 0;

        recommendedIndexes.forEach((rec) => {
            const exists = indexes.some((idx) => {
                const idxFields = Object.keys(idx.key);
                return JSON.stringify(idxFields) === JSON.stringify(rec.fields);
            });

            if (exists) {
                console.log(
                    `   ✅ ${rec.critical ? '🎯 ' : ''}${rec.name} → OPTIMO`
                );
                optimalCount++;
            } else {
                console.log(
                    `   ❌ ${rec.critical ? '🎯 ' : ''}${rec.name} → FALTANTE`
                );
            }
        });

        console.log(
            `\n📈 ESTADO: ${optimalCount >= 1 ? '✅ ÓPTIMO' : '⚠️  MEJORABLE'}`
        );
        console.log(
            `   ${optimalCount}/${recommendedIndexes.length} índices óptimos`
        );

        if (optimalCount < recommendedIndexes.length) {
            console.log(
                '\n💡 RECOMENDACIÓN: Ejecuta quick-indexes.js para crear índices faltantes'
            );
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

export async function diagnoseIndexPerformance() {
    try {
        console.log('🔍 DIAGNÓSTICO DE RENDIMIENTO DE ÍNDICES\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // Test 1: Consulta simple con explain
        console.log('1. 📊 CONSULTA SIMPLE (user_id + timestamp_num):');
        const query1 = {
            user_id: testUserId,
            timestamp_num: {
                $gte: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
            },
        };

        const explain1 = await collection
            .find(query1)
            .sort({ timestamp_num: -1 })
            .limit(10)
            .explain();
        const plan1 = explain1.queryPlanner.winningPlan;

        console.log(
            `   - Índice usado: ${
                plan1.inputStage?.stage === 'IXSCAN' ? '✅ SÍ' : '❌ NO'
            }`
        );
        if (plan1.inputStage?.stage === 'IXSCAN') {
            console.log(`   - Nombre índice: ${plan1.inputStage.indexName}`);
            console.log(`   - Dirección: ${plan1.inputStage.direction}`);
        }
        console.log(
            `   - Documentos examinados: ${
                explain1.executionStats?.nReturned || 'N/A'
            }`
        );
        console.log(
            `   - Tiempo ejecución: ${
                explain1.executionStats?.executionTimeMillis || 'N/A'
            }ms\n`
        );

        // Test 2: Verificar estadísticas de índices
        console.log('2. 📈 ESTADÍSTICAS DE ÍNDICES:');
        const indexes = await collection.indexes();

        indexes.forEach((index) => {
            const keys = Object.entries(index.key)
                .map(([key, value]) => `${key}:${value}`)
                .join(',');
            console.log(`   - ${index.name}: {${keys}}`);
        });

        // Test 3: Consulta que debería usar el índice compuesto
        console.log('\n3. 🎯 CONSULTA QUE DEBERÍA USAR ÍNDICE COMPUESTO:');
        const query3 = {
            user_id: testUserId,
            activity_type: 'running', // Cambia por un tipo que exista
            timestamp_num: {
                $gte: new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
            },
        };

        try {
            const explain3 = await collection
                .find(query3)
                .sort({ timestamp_num: -1 })
                .limit(5)
                .explain();
            const plan3 = explain3.queryPlanner.winningPlan;

            console.log(
                `   - Índice usado: ${
                    plan3.inputStage?.stage === 'IXSCAN' ? '✅ SÍ' : '❌ NO'
                }`
            );
            if (plan3.inputStage?.stage === 'IXSCAN') {
                console.log(`   - Índice: ${plan3.inputStage.indexName}`);
            }
        } catch (error) {
            console.log(`   - Error: ${error.message}`);
        }

        // Test 4: Verificar si hay problemas con los datos
        console.log('\n4. 🔍 VERIFICACIÓN DE DATOS:');
        const userDocs = await collection.countDocuments({
            user_id: testUserId,
        });
        const withTimestampNum = await collection.countDocuments({
            user_id: testUserId,
            timestamp_num: { $exists: true, $ne: null, $type: 'number' },
        });

        console.log(`   - Total documentos usuario: ${userDocs}`);
        console.log(`   - Con timestamp_num válido: ${withTimestampNum}`);
        console.log(
            `   - Porcentaje válido: ${(
                (withTimestampNum / userDocs) *
                100
            ).toFixed(1)}%`
        );

        // Test 5: Performance real
        console.log('\n5. ⚡ TEST DE PERFORMANCE REAL:');
        const startTime = Date.now();
        const results = await collection
            .find(query1)
            .sort({ timestamp_num: -1 })
            .limit(10)
            .toArray();
        const realTime = Date.now() - startTime;

        console.log(`   - Tiempo real: ${realTime}ms`);
        console.log(`   - Documentos retornados: ${results.length}`);
        console.log(
            `   - Performance: ${
                realTime < 100
                    ? '✅ EXCELENTE'
                    : realTime < 500
                    ? '✅ BUENA'
                    : '❌ MALA'
            }`
        );
    } catch (error) {
        console.error('❌ Error en diagnóstico:', error);
    }
}

export async function rebuildIndexes() {
    try {
        console.log('🔄 RECONSTRUYENDO ÍNDICES OPTIMIZADOS\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. Eliminar índices existentes (excepto _id_)
        const existingIndexes = await collection.indexes();

        for (const index of existingIndexes) {
            if (index.name !== '_id_') {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`🗑️  Eliminado: ${index.name}`);
                } catch (error) {
                    console.log(
                        `⚠️  No se pudo eliminar ${index.name}: ${error.message}`
                    );
                }
            }
        }

        // 2. Crear nuevos índices optimizados
        console.log('\n🔧 CREANDO NUEVOS ÍNDICES:');

        const newIndexes = [
            {
                keys: { user_id: 1, timestamp_num: -1 },
                options: { name: 'idx_perf_user_timestamp', background: true },
            },
            {
                keys: { user_id: 1, activity_type: 1, timestamp_num: -1 },
                options: {
                    name: 'idx_perf_user_type_timestamp',
                    background: true,
                },
            },
            {
                keys: { user_id: 1, timestamp_num: -1, activity_type: 1 },
                options: { name: 'idx_perf_covering', background: true },
            },
        ];

        for (const index of newIndexes) {
            try {
                await collection.createIndex(index.keys, index.options);
                console.log(`✅ Creado: ${index.options.name}`);

                // Pequeña pausa entre índices
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.log(
                    `❌ Error creando ${index.options.name}: ${error.message}`
                );
            }
        }

        console.log('\n✅ RECONSTRUCCIÓN COMPLETADA');
        console.log('🎯 Ejecuta el diagnóstico para verificar mejoras');
    } catch (error) {
        console.error('❌ Error reconstruyendo índices:', error);
    }
}

export async function createOptimalIndexes() {
    try {
        console.log('🎯 CREANDO ÍNDICES ÓPTIMOS DIRECTAMENTE\n');

        const collection = mongoose.connection.db.collection('activities');

        // Eliminar índices existentes problemáticos primero
        console.log('🧹 Limpiando índices existentes...');
        const existingIndexes = await collection.indexes();
        for (const index of existingIndexes) {
            if (index.name !== '_id_') {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`   🗑️  Eliminado: ${index.name}`);
                } catch (error) {
                    console.log(`   ⚠️  No se pudo eliminar ${index.name}`);
                }
            }
        }

        // Crear nuevos índices optimizados
        const optimalIndexes = [
            {
                keys: { user_id: 1, timestamp_num: -1 },
                options: {
                    name: 'idx_optimal_user_timestamp',
                    background: true,
                },
            },
            {
                keys: { user_id: 1, activity_type: 1, timestamp_num: -1 },
                options: {
                    name: 'idx_optimal_user_type_timestamp',
                    background: true,
                },
            },
            {
                keys: { user_id: 1, timestamp_num: -1, activity_type: 1 },
                options: { name: 'idx_optimal_covering', background: true },
            },
        ];

        console.log('\n🔧 Creando nuevos índices...');
        for (const index of optimalIndexes) {
            try {
                await collection.createIndex(index.keys, index.options);
                console.log(`   ✅ ${index.options.name}`);

                // Pequeña pausa
                await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (error) {
                console.log(`   ❌ ${index.options.name}: ${error.message}`);
            }
        }

        // Verificación final
        console.log('\n📊 VERIFICACIÓN FINAL:');
        const finalIndexes = await collection.indexes();
        console.log(`   Total de índices: ${finalIndexes.length}`);

        finalIndexes.forEach((index) => {
            if (index.name !== '_id_') {
                console.log(`   - ${index.name}`);
            }
        });

        console.log(
            '\n🎯 ¡Índices óptimos creados! Ejecuta el benchmark nuevamente.'
        );
    } catch (error) {
        console.error('❌ Error creando índices:', error);
    }
}

export async function findRealIssue() {
    try {
        console.log('🔍 IDENTIFICANDO EL PROBLEMA REAL\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // 1. Verificar EXACTAMENTE qué está pasando con la query del benchmark
        console.log('1. 🎯 ANALIZANDO QUERY DEL BENCHMARK:');
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const benchmarkQuery = {
            user_id: testUserId,
            timestamp_num: { $gte: sevenDaysAgo.getTime() },
        };

        console.log('   Query:', JSON.stringify(benchmarkQuery, null, 2));
        console.log('   SevenDaysAgo timestamp:', sevenDaysAgo.getTime());
        console.log('   SevenDaysAgo ISO:', sevenDaysAgo.toISOString());

        // 2. Verificar si hay documentos en ese rango
        console.log('\n2. 📊 DOCUMENTOS EN EL RANGO:');
        const docsInRange = await collection.find(benchmarkQuery).toArray();
        console.log('   - Documentos encontrados:', docsInRange.length);

        if (docsInRange.length === 0) {
            // 3. Verificar los documentos más recientes del usuario
            console.log('\n3. 🔍 BUSCANDO DOCUMENTOS MÁS RECIENTES:');
            const recentDocs = await collection
                .find({ user_id: testUserId })
                .sort({ timestamp_num: -1 })
                .limit(5)
                .toArray();

            console.log('   - Documentos más recientes del usuario:');
            recentDocs.forEach((doc, i) => {
                const docDate = new Date(doc.timestamp_num);
                const daysAgo =
                    (Date.now() - doc.timestamp_num) / (1000 * 60 * 60 * 24);
                console.log(
                    `     ${
                        i + 1
                    }. ${docDate.toISOString()} (hace ${daysAgo.toFixed(
                        1
                    )} días) - ${doc.activity_type}`
                );
            });

            // 4. Probar con un rango más amplio
            console.log('\n4. 🧪 PROBANDO RANGO MÁS AMPLIO (30 días):');
            const thirtyDaysAgo = new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
            );
            const widerQuery = {
                user_id: testUserId,
                timestamp_num: { $gte: thirtyDaysAgo.getTime() },
            };

            const widerResults = await collection.find(widerQuery).toArray();
            console.log(
                '   - Documentos en últimos 30 días:',
                widerResults.length
            );
        }

        // 5. Verificar uso de índices con explain
        console.log('\n5. 🔧 ANALIZANDO USO DE ÍNDICES:');
        const explain = await collection
            .find(benchmarkQuery)
            .explain('executionStats');
        const plan = explain.queryPlanner.winningPlan;

        console.log('   - Plan:', plan.stage);
        if (plan.inputStage) {
            console.log('   - Stage interno:', plan.inputStage.stage);
            console.log('   - Índice:', plan.inputStage.indexName || 'NINGUNO');
        }
        console.log(
            '   - Docs examinados:',
            explain.executionStats.totalDocsExamined
        );
        console.log(
            '   - Tiempo ejecución:',
            explain.executionStats.executionTimeMillis + 'ms'
        );
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

export async function nuclearIndexRebuild() {
    try {
        console.log('💥 RECONSTRUCCIÓN NUCLEAR DE ÍNDICES\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. Eliminar TODOS los índices excepto _id_
        console.log('1. 🗑️ ELIMINANDO TODOS LOS ÍNDICES...');
        const indexes = await collection.indexes();

        for (const index of indexes) {
            if (index.name !== '_id_') {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`   ✅ Eliminado: ${index.name}`);
                } catch (error) {
                    console.log(
                        `   ⚠️ Error eliminando ${index.name}: ${error.message}`
                    );
                }
            }
        }

        // 2. Crear SOLO los índices esenciales
        console.log('\n2. 🔧 CREANDO ÍNDICES ESENCIALES...');

        const essentialIndexes = [
            // ÍNDICE PRINCIPAL - debe ser usado por las queries
            {
                keys: { user_id: 1, timestamp_num: -1 },
                options: { name: 'primary_query_idx', background: false }, // foreground para prioridad
            },
        ];

        for (const index of essentialIndexes) {
            try {
                await collection.createIndex(index.keys, index.options);
                console.log(`   ✅ Creado: ${index.options.name}`);
            } catch (error) {
                console.log(
                    `   ❌ Error: ${index.options.name} - ${error.message}`
                );
            }
        }

        // 3. Verificar
        console.log('\n3. 📊 VERIFICACIÓN FINAL:');
        const finalIndexes = await collection.indexes();
        console.log('   Índices activos:');
        finalIndexes.forEach((idx) => {
            console.log(`   - ${idx.name}:`, JSON.stringify(idx.key));
        });

        console.log('\n🎯 RECONSTRUCCIÓN COMPLETADA');
    } catch (error) {
        console.error('❌ Error nuclear:', error);
    }
}

export async function quickPerformanceTest() {
    try {
        console.log('⚡ TEST RÁPIDO DE PERFORMANCE\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // Test 1: Consulta básica con índice
        console.log('1. Consulta básica con user_id + timestamp_num:');
        const start1 = Date.now();
        const result1 = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: Date.now() - 7 * 24 * 60 * 60 * 1000 },
            })
            .sort({ timestamp_num: -1 })
            .limit(10)
            .toArray();
        const time1 = Date.now() - start1;

        console.log(`   - Tiempo: ${time1}ms`);
        console.log(`   - Documentos: ${result1.length}`);
        console.log(
            `   - Performance: ${
                time1 < 50
                    ? '✅ EXCELENTE'
                    : time1 < 200
                    ? '✅ BUENA'
                    : '❌ MALA'
            }`
        );

        // Test 2: Consulta con explain para ver índice
        console.log('\n2. Verificación de índice usado:');
        const explain = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: 0 }, // Rango amplio
            })
            .sort({ timestamp_num: -1 })
            .limit(5)
            .explain();

        const indexUsed =
            explain.queryPlanner.winningPlan.inputStage?.indexName;
        console.log(`   - Índice usado: ${indexUsed || '❌ NINGUNO'}`);

        if (!indexUsed) {
            console.log('   🚨 PROBLEMA: La consulta no está usando índices!');
        }
    } catch (error) {
        console.error('❌ Error en test:', error);
    }
}

export async function nuclearIndexFix() {
    try {
        console.log('💥 EXECUTING NUCLEAR INDEX FIX...\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. ELIMINAR ÍNDICES PROBLEMÁTICOS
        console.log('1. 🗑️ Removing problematic indexes...');
        const indexes = await collection.indexes();

        for (const index of indexes) {
            if (index.name !== '_id_') {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`   ✅ Dropped: ${index.name}`);
                } catch (error) {
                    // Ignorar errores de índices que no existen
                }
            }
        }

        // 2. CREAR ÍNDICE ÚNICO Y SIMPLE
        console.log('\n2. 🔧 Creating optimized single index...');
        await collection.createIndex(
            { user_id: 1, timestamp_num: -1 },
            {
                name: 'activities_main_idx',
                background: true,
            }
        );

        console.log('   ✅ Main index created');

        // 3. VERIFICAR
        console.log('\n3. 📊 Final index status:');
        const finalIndexes = await collection.indexes();
        finalIndexes.forEach((idx) => {
            if (idx.name !== '_id_') {
                console.log(`   - ${idx.name}:`, JSON.stringify(idx.key));
            }
        });

        // 4. TEST INMEDIATO
        console.log('\n4. 🧪 Immediate performance test:');
        const testUserId = '66293179a9f2428db80a6b23';
        const startTime = Date.now();

        const results = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: Date.now() - 365 * 24 * 60 * 60 * 1000 },
            })
            .sort({ timestamp_num: -1 })
            .limit(50)
            .toArray();

        const queryTime = Date.now() - startTime;

        console.log(`   - Query time: ${queryTime}ms`);
        console.log(`   - Documents found: ${results.length}`);
        console.log(
            `   - Performance: ${
                queryTime < 100
                    ? '✅ EXCELLENT'
                    : queryTime < 500
                    ? '✅ GOOD'
                    : '❌ POOR'
            }`
        );

        console.log('\n🎯 NUCLEAR FIX COMPLETED!');
    } catch (error) {
        console.error('❌ Nuclear fix error:', error);
    }
}

export async function verifyFinalFix() {
    try {
        console.log('🔍 VERIFYING FINAL FIX STATUS...\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. Verificar índices
        console.log('1. 📊 Checking indexes...');
        const indexes = await collection.indexes();
        indexes.forEach((idx) => {
            console.log(`   - ${idx.name}:`, JSON.stringify(idx.key));
        });

        // 2. Test de consulta con explain
        console.log('\n2. 🧪 Testing query with explain...');
        const testUserId = '66293179a9f2428db80a6b23';

        const explain = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: 1000 },
            })
            .explain();

        const plan = explain.queryPlanner.winningPlan;
        console.log(`   - Query plan: ${plan.stage}`);
        if (plan.inputStage?.stage === 'IXSCAN') {
            console.log(`   ✅ INDEX BEING USED: ${plan.inputStage.indexName}`);
        } else {
            console.log(`   ❌ NO INDEX USED: ${plan.stage}`);
        }

        // 3. Performance test real
        console.log('\n3. ⚡ Real performance test...');
        const startTime = Date.now();
        const results = await collection
            .find({
                user_id: testUserId,
            })
            .sort({ timestamp_num: -1 })
            .limit(20)
            .toArray();

        const queryTime = Date.now() - startTime;
        console.log(`   - Time: ${queryTime}ms`);
        console.log(`   - Documents: ${results.length}`);
        console.log(
            `   - Status: ${queryTime < 100 ? '✅ OPTIMAL' : '⚠️ NEEDS WORK'}`
        );
    } catch (error) {
        console.error('❌ Verification error:', error);
    }
}

export async function forceIndexUsage() {
    try {
        console.log('💪 FORCING INDEX USAGE WITH HINT...\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // 1. ELIMINAR TODOS LOS ÍNDICES Y CREAR UNO SOLO
        console.log('1. 🗑️ Removing ALL indexes...');
        const indexes = await collection.indexes();

        for (const index of indexes) {
            if (index.name !== '_id_') {
                await collection.dropIndex(index.name);
                console.log(`   ✅ Dropped: ${index.name}`);
            }
        }

        // 2. CREAR ÚNICO ÍNDICE CON NOMBRE CORTO
        console.log('\n2. 🔧 Creating single optimized index...');
        await collection.createIndex(
            { user_id: 1, timestamp_num: -1 },
            {
                name: 'idx_main',
                background: false, // FOREGROUND para máxima prioridad
            }
        );

        // 3. ACTUALIZAR ESTADÍSTICAS
        console.log('\n3. 📊 Updating collection statistics...');
        try {
            await collection.stats();
        } catch (e) {
            // Ignorar si no está disponible
        }

        // 4. TEST CON HINT FORZADO
        console.log('\n4. 🧪 Testing with FORCED INDEX usage...');

        const query = {
            user_id: testUserId,
            timestamp_num: { $gte: Date.now() - 365 * 24 * 60 * 60 * 1000 },
        };

        // Test SIN hint
        console.log('   a) Testing WITHOUT hint:');
        const start1 = Date.now();
        const results1 = await collection
            .find(query)
            .sort({ timestamp_num: -1 })
            .limit(50)
            .toArray();
        const time1 = Date.now() - start1;
        console.log(`      - Time: ${time1}ms`);
        console.log(`      - Documents: ${results1.length}`);

        // Test CON hint
        console.log('   b) Testing WITH hint:');
        const start2 = Date.now();
        const results2 = await collection
            .find(query)
            .sort({ timestamp_num: -1 })
            .limit(50)
            .hint('idx_main') // FORZAR ÍNDICE
            .toArray();
        const time2 = Date.now() - start2;
        console.log(`      - Time: ${time2}ms`);
        console.log(`      - Documents: ${results2.length}`);

        // 5. EXPLAIN PARA VER DIFERENCIA
        console.log('\n5. 🔍 Explain plans comparison:');

        const explainNoHint = await collection.find(query).limit(5).explain();
        console.log('   a) WITHOUT hint:');
        console.log(
            `      - Stage: ${explainNoHint.queryPlanner.winningPlan.stage}`
        );
        if (explainNoHint.queryPlanner.winningPlan.inputStage) {
            console.log(
                `      - Index: ${
                    explainNoHint.queryPlanner.winningPlan.inputStage
                        .indexName || 'NONE'
                }`
            );
        }

        const explainWithHint = await collection
            .find(query)
            .hint('idx_main')
            .limit(5)
            .explain();
        console.log('   b) WITH hint:');
        console.log(
            `      - Stage: ${explainWithHint.queryPlanner.winningPlan.stage}`
        );
        if (explainWithHint.queryPlanner.winningPlan.inputStage) {
            console.log(
                `      - Index: ${
                    explainWithHint.queryPlanner.winningPlan.inputStage
                        .indexName || 'NONE'
                }`
            );
        }

        console.log('\n🎯 FORCE INDEX COMPLETED!');
    } catch (error) {
        console.error('❌ Force index error:', error);
    }
}

export async function deepDiagnostic() {
    try {
        console.log('🔍 DEEP DIAGNOSTIC - FINDING THE ROOT CAUSE\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // 1. VERIFICAR ESTADO DE LA COLECCIÓN
        console.log('1. 📊 Collection status:');
        const stats = await collection.stats();
        console.log(`   - Documents: ${stats.count}`);
        console.log(`   - Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(
            `   - Avg doc size: ${(stats.avgObjSize / 1024).toFixed(2)} KB`
        );
        console.log(
            `   - Storage: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
        );

        // 2. VERIFICAR DISTRIBUCIÓN DE DATOS
        console.log('\n2. 📈 Data distribution:');
        const userStats = await collection
            .aggregate([
                {
                    $group: {
                        _id: '$user_id',
                        count: { $sum: 1 },
                        min_timestamp: { $min: '$timestamp_num' },
                        max_timestamp: { $max: '$timestamp_num' },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ])
            .toArray();

        console.log('   Top users by document count:');
        userStats.forEach((user) => {
            const minDate = new Date(user.min_timestamp)
                .toISOString()
                .split('T')[0];
            const maxDate = new Date(user.max_timestamp)
                .toISOString()
                .split('T')[0];
            console.log(
                `   - ${user._id}: ${user.count} docs (${minDate} to ${maxDate})`
            );
        });

        // 3. VERIFICAR QUERY PLANNER
        console.log('\n3. 🤖 Query planner analysis:');
        const testQuery = {
            user_id: testUserId,
            timestamp_num: { $gte: 1000 },
        };

        const explain = await collection
            .find(testQuery)
            .explain('allPlansExecution');
        const winningPlan = explain.queryPlanner.winningPlan;
        const rejectedPlans = explain.queryPlanner.rejectedPlans || [];

        console.log(`   - Winning plan: ${winningPlan.stage}`);
        if (winningPlan.inputStage) {
            console.log(
                `   - Index used: ${winningPlan.inputStage.indexName || 'NONE'}`
            );
        }

        console.log(`   - Rejected plans: ${rejectedPlans.length}`);
        rejectedPlans.forEach((plan) => {
            if (plan.inputStage?.indexName) {
                console.log(
                    `     - Rejected index: ${plan.inputStage.indexName}`
                );
            }
        });

        // 4. TEST DE PERFORMANCE CON DIFERENTES ESTRATEGIAS
        console.log('\n4. ⚡ Performance strategies test:');

        // Estrategia A: Query normal
        console.log('   a) Normal query:');
        const startA = Date.now();
        const resultA = await collection.find(testQuery).limit(10).toArray();
        const timeA = Date.now() - startA;
        console.log(`      - Time: ${timeA}ms, Docs: ${resultA.length}`);

        // Estrategia B: Solo user_id (debería usar índice simple)
        console.log('   b) Only user_id:');
        const startB = Date.now();
        const resultB = await collection
            .find({ user_id: testUserId })
            .limit(10)
            .toArray();
        const timeB = Date.now() - startB;
        console.log(`      - Time: ${timeB}ms, Docs: ${resultB.length}`);

        // Estrategia C: Con hint
        console.log('   c) With hint:');
        const startC = Date.now();
        const resultC = await collection
            .find(testQuery)
            .hint('idx_main')
            .limit(10)
            .toArray();
        const timeC = Date.now() - startC;
        console.log(`      - Time: ${timeC}ms, Docs: ${resultC.length}`);

        // 5. RECOMENDACIÓN FINAL
        console.log('\n5. 🎯 FINAL RECOMMENDATION:');

        if (timeC < timeA && timeC < 100) {
            console.log(
                '   ✅ USE HINT: Index works with hint, use forced index approach'
            );
        } else if (timeB < 100) {
            console.log('   ✅ USE SIMPLE INDEX: user_id index works well');
        } else {
            console.log(
                '   ❌ PROBLEM PERSISTS: Consider database repair or reindex'
            );
        }
    } catch (error) {
        console.error('❌ Deep diagnostic error:', error);
    }
}

export async function emergencyRebuild() {
    try {
        console.log('🚨 EMERGENCY REBUILD - LAST RESORT\n');

        const collection = mongoose.connection.db.collection('activities');

        // 1. CREAR COLECCIÓN TEMPORAL
        console.log('1. 🛠️ Creating temporary collection...');
        const tempCollectionName = 'activities_temp_' + Date.now();
        await mongoose.connection.db.createCollection(tempCollectionName);
        const tempCollection =
            mongoose.connection.db.collection(tempCollectionName);

        // 2. COPIAR DATOS
        console.log('2. 📋 Copying data...');
        const documents = await collection.find({}).toArray();
        if (documents.length > 0) {
            await tempCollection.insertMany(documents);
        }

        // 3. ELIMINAR COLECCIÓN ORIGINAL
        console.log('3. 🗑️ Dropping original collection...');
        await collection.drop();

        // 4. CREAR NUEVA COLECCIÓN CON ÍNDICES
        console.log('4. 🔧 Recreating collection with indexes...');
        await mongoose.connection.db.createCollection('activities');
        const newCollection = mongoose.connection.db.collection('activities');

        // Copiar datos de vuelta
        if (documents.length > 0) {
            await newCollection.insertMany(documents);
        }

        // Crear índice PRINCIPAL
        await newCollection.createIndex(
            { user_id: 1, timestamp_num: -1 },
            { name: 'primary_idx', background: false }
        );

        // 5. ELIMINAR TEMPORAL
        console.log('5. 🧹 Cleaning up...');
        await tempCollection.drop();

        console.log('✅ EMERGENCY REBUILD COMPLETED!');
        console.log('🎯 Collection completely rebuilt with fresh indexes');
    } catch (error) {
        console.error('❌ Emergency rebuild error:', error);
    }
}

export async function compatibleDiagnostic() {
    try {
        console.log('🔍 COMPATIBLE DIAGNOSTIC\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // 1. VERIFICAR ÍNDICES ACTUALES
        console.log('1. 📊 Current indexes:');
        const indexes = await collection.indexes();
        indexes.forEach((idx) => {
            const keys = Object.entries(idx.key)
                .map(([key, value]) => `${key}:${value}`)
                .join(',');
            console.log(`   - ${idx.name}: {${keys}}`);
        });

        // 2. CONTAR DOCUMENTOS
        console.log('\n2. 📈 Document counts:');
        const totalDocs = await collection.countDocuments();
        const userDocs = await collection.countDocuments({
            user_id: testUserId,
        });
        console.log(`   - Total documents: ${totalDocs}`);
        console.log(`   - Documents for test user: ${userDocs}`);

        // 3. TEST DE PERFORMANCE CON DIFERENTES ENFOQUES
        console.log('\n3. ⚡ Performance tests:');

        const testQuery = {
            user_id: testUserId,
            timestamp_num: { $gte: Date.now() - 365 * 24 * 60 * 60 * 1000 },
        };

        // Test A: Query normal
        console.log('   a) Normal query:');
        const startA = Date.now();
        const resultA = await collection
            .find(testQuery)
            .sort({ timestamp_num: -1 })
            .limit(20)
            .toArray();
        const timeA = Date.now() - startA;
        console.log(`      - Time: ${timeA}ms, Docs: ${resultA.length}`);

        // Test B: Solo user_id (debería usar índice user_id_1)
        console.log('   b) Only user_id:');
        const startB = Date.now();
        const resultB = await collection
            .find({ user_id: testUserId })
            .limit(20)
            .toArray();
        const timeB = Date.now() - startB;
        console.log(`      - Time: ${timeB}ms, Docs: ${resultB.length}`);

        // Test C: Con hint del índice compuesto
        console.log('   c) With compound index hint:');
        const startC = Date.now();
        const resultC = await collection
            .find(testQuery)
            .sort({ timestamp_num: -1 })
            .limit(20)
            .hint('idx_main_query') // Usar el índice que ya existe
            .toArray();
        const timeC = Date.now() - startC;
        console.log(`      - Time: ${timeC}ms, Docs: ${resultC.length}`);

        // Test D: Con hint del índice simple
        console.log('   d) With simple index hint:');
        const startD = Date.now();
        const resultD = await collection
            .find({ user_id: testUserId })
            .hint('user_id_1')
            .limit(20)
            .toArray();
        const timeD = Date.now() - startD;
        console.log(`      - Time: ${timeD}ms, Docs: ${resultD.length}`);

        // 4. EXPLAIN DE LOS DIFERENTES ENFOQUES
        console.log('\n4. 🔍 Explain analysis:');

        try {
            const explainNormal = await collection
                .find(testQuery)
                .limit(5)
                .explain();
            console.log('   a) Normal query plan:');
            console.log(
                `      - Stage: ${explainNormal.queryPlanner.winningPlan.stage}`
            );

            const explainHint = await collection
                .find(testQuery)
                .hint('idx_main_query')
                .limit(5)
                .explain();
            console.log('   b) With hint plan:');
            console.log(
                `      - Stage: ${explainHint.queryPlanner.winningPlan.stage}`
            );
        } catch (error) {
            console.log('   ⚠️ Explain not available');
        }

        // 5. RECOMENDACIÓN BASADA EN RESULTADOS
        console.log('\n5. 🎯 RECOMMENDATION:');

        const times = { normal: timeA, compound: timeC, simple: timeD };
        const bestApproach = Object.keys(times).reduce((a, b) =>
            times[a] < times[b] ? a : b
        );

        console.log(
            `   - Fastest approach: ${bestApproach} (${times[bestApproach]}ms)`
        );

        if (bestApproach === 'compound' && timeC < 100) {
            console.log('   ✅ USE COMPOUND INDEX WITH HINT');
        } else if (bestApproach === 'simple' && timeD < 100) {
            console.log('   ✅ USE SIMPLE INDEX WITH HINT');
        } else if (timeB < 100) {
            console.log('   ✅ USE SIMPLE QUERY (only user_id)');
        } else {
            console.log(
                '   ❌ ALL APPROACHES ARE SLOW - NEEDS DRASTIC SOLUTION'
            );
        }
    } catch (error) {
        console.error('❌ Diagnostic error:', error.message);
    }
}

export async function definitiveFix() {
    try {
        console.log('🎯 DEFINITIVE FIX - RECREATING FROM SCRATCH\n');

        const collection = mongoose.connection.db.collection('activities');
        const testUserId = '66293179a9f2428db80a6b23';

        // 1. BACKUP DE DATOS CRÍTICOS
        console.log('1. 💾 Backing up user data...');
        const userDocuments = await collection
            .find({ user_id: testUserId })
            .toArray();
        console.log(
            `   - Backed up ${userDocuments.length} documents for test user`
        );

        // 2. ELIMINAR TODOS LOS ÍNDICES EXISTENTES
        console.log('2. 🗑️ Removing all indexes...');
        const indexes = await collection.indexes();
        for (const index of indexes) {
            if (index.name !== '_id_') {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`   ✅ Dropped: ${index.name}`);
                } catch (error) {
                    // Ignorar errores
                }
            }
        }

        // 3. CREAR SOLO UN ÍNDICE PRINCIPAL
        console.log('3. 🔧 Creating single main index...');
        await collection.createIndex(
            { user_id: 1, timestamp_num: -1 },
            {
                name: 'main_perf_idx',
                background: false, // FOREGROUND para máxima prioridad
            }
        );
        console.log('   ✅ Main index created');

        // 4. VERIFICAR QUE EL ÍNDICE SE USA
        console.log('4. 🧪 Verifying index usage...');

        // Test con hint forzado
        const startTime = Date.now();
        const results = await collection
            .find({
                user_id: testUserId,
                timestamp_num: { $gte: 0 },
            })
            .sort({ timestamp_num: -1 })
            .limit(50)
            .hint('main_perf_idx')
            .toArray();

        const queryTime = Date.now() - startTime;

        console.log(`   - Query time with hint: ${queryTime}ms`);
        console.log(`   - Documents found: ${results.length}`);

        if (queryTime < 100) {
            console.log('   ✅ SUCCESS: Index working with hint');
        } else {
            console.log('   ⚠️ WARNING: Still slow with hint');
        }

        // 5. ACTUALIZAR EL SERVICIO PARA USAR HINT
        console.log('\n5. 📝 Updating service to use hint...');
        console.log('   Replace getAllWithoutArray with hint version');

        console.log('\n🎯 DEFINITIVE FIX COMPLETED!');
        console.log(
            '💡 Use the hint version of getAllWithoutArray for production'
        );
    } catch (error) {
        console.error('❌ Definitive fix error:', error.message);
    }
}

export async function finalBenchmark() {
    try {
        console.log('🏁 FINAL BENCHMARK WITH HINT\n');

        const testUserId = '66293179a9f2428db80a6b23';
        const iterations = 3; // Menos iteraciones para prueba rápida

        // Test 1: 7 días con hint
        console.log('📊 Test 1: 7 days with hint');
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const times1 = [];
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            const result = await ActivitiesServices.getAllWithoutArray(
                testUserId,
                {
                    startDate: sevenDaysAgo.toISOString(),
                    limit: 7,
                }
            );
            const duration = Date.now() - start;
            times1.push(duration);
            console.log(
                `   Iteración ${i + 1}: ${duration}ms (${result.length} docs)`
            );
        }
        const avg1 = times1.reduce((a, b) => a + b, 0) / times1.length;
        console.log(`   ⏱️  Promedio: ${Math.round(avg1)}ms\n`);

        // Solo estos tests para verificar
        console.log('🎯 QUICK VERIFICATION COMPLETE');
        console.log(`   Target: <100ms, Actual: ${Math.round(avg1)}ms`);
        console.log(
            `   Status: ${avg1 < 100 ? '✅ SUCCESS' : '❌ NEEDS WORK'}`
        );
    } catch (error) {
        console.error('❌ Benchmark error:', error);
    }
}

export async function checkConnection() {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized',
    };

    console.log(
        '🔍 Connection status:',
        states[mongoose.connection.readyState]
    );
    console.log('📊 Database available:', !!mongoose.connection.db);

    if (mongoose.connection.db) {
        try {
            const collections = await mongoose.connection.db
                .listCollections()
                .toArray();
            console.log(
                '📋 Available collections:',
                collections.map((c) => c.name)
            );
        } catch (error) {
            console.log('❌ Cannot list collections:', error.message);
        }
    }
}

// (async () => {
//     await new Promise((resolve) => {
//         if (mongoose.connection.readyState === 1) {
//             resolve();
//         } else {
//             mongoose.connection.once('open', resolve);
//         }
//     });
//     await checkConnection();
// })();

// await quickPerformanceTest();
