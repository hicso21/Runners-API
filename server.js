import axios from 'axios';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import fs from 'fs';
import logger from 'morgan';
import { createServer } from 'node:http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import sockets from './sockets.js';
import connectDB from './src/db/mongoDB.js'; // Importar función de conexión
import router from './src/routes/v1/index.js';
import RunnersServices from './src/services/v1/Runners/runners.services.js';
import currentVersion from './src/utils/constants/currentVersion.js';
import mongoose from 'mongoose';

config();

const PORT = process.env.PORT || 8080;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, 'public/pdfs');
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'https://delaf.vercel.app',
            'https://delaf.host',
            'https://desktop.delaf.host',
            'exp://hg-cet.hicso.8081.exp.direct',
        ],
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE', 'POST', 'UPDATE', 'PUT'],
    },
    connectionStateRecovery: {},
});

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://delaf.vercel.app',
            'https://delaf.host',
            'https://desktop.delaf.host',
        ],
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE', 'POST', 'UPDATE', 'PUT'],
    })
);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(logger('dev'));

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // El formato típico es "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res
            .status(401)
            .json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verificar el token
        const usuarioVerificado = jwt.verify(token, process.env.jwt_secret);

        // Agregar la información del usuario al objeto request
        req.usuario = usuarioVerificado;

        // Continuar con la siguiente función
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                mensaje: 'Token expirado. Por favor, inicie sesión nuevamente.',
            });
        }

        return res.status(403).json({ mensaje: 'Token inválido.' });
    }
};

sockets(io);

function rateLimiter({ windowMs = 60000, max = 100 }) {
    // Almacén en memoria para las solicitudes por IP
    const requests = new Map();

    // Retornamos la función de middleware
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;

        // Si es la primera solicitud para esta IP, inicializamos
        if (!requests.has(ip)) {
            requests.set(ip, {
                count: 1,
                resetTime: Date.now() + windowMs,
            });
            return next();
        }

        const client = requests.get(ip);
        const now = Date.now();

        // Si ha pasado el tiempo de reset, reiniciamos el contador
        if (now > client.resetTime) {
            client.count = 1;
            client.resetTime = now + windowMs;
            return next();
        }

        // Si excede el máximo de solicitudes
        if (client.count >= max) {
            return res.status(429).json({
                mensaje: 'Demasiadas solicitudes, por favor intente más tarde',
                retryAfter: Math.ceil((client.resetTime - now) / 1000),
            });
        }

        // Incrementamos el contador
        client.count++;
        next();
    };
}

app.use(rateLimiter({ windowMs: 30 * 1000, max: 10 })); // 10 cada medio minuto

app.use(
    '/api/v1',
    (req, res, next) => {
        req.href = `${req.protocol}://${req.hostname}:${PORT}`;
        next();
    },
    router
);

app.get('/terms', (req, res) => {
    fs.readFile('./public/pdfs/terms&conditions.pdf', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const base64 = data.toString('base64');
        res.send(base64);
    });
});

// version 1 of the api routes to all brands
app.get('/api/version', (req, res) =>
    res.send('Version in use: ' + currentVersion)
);

app.get('/test', async (req, res) => {
    try {
        const runner = await RunnersServices.getByBrandId('martinurquiza');
        const { data } = await axios.get(
            `https://cloudapi.suunto.com/v3/workouts/6711919055a9220c7471d6c2`,
            {
                headers: {
                    Authorization: runner.refresh_token,
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': process.env.suunto_primary_key,
                },
            }
        );
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error('Error en /test:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', async (req, res) => {
    res.send(`
        <div style="position:absolute;top:0;left:0;height:100dvh;width:100dvw;display:flex;flex-direction:column;justify-content:center;align-items:center">
                <h1>
                    DELAF API
                </h1>
                <h2 style="text-align:center;display:flex">
		            Version: ${currentVersion}
                    <br/>
                    ${new Date()}
                </h2>
            </div>
		
    `);
});

app.get('/status', async (req, res) => {
    res.send(
        `
            <div style="position:absolute;top:0;left:0;height:100dvh;width:100dvw;display:flex;justify-content:center;align-items:center">
                <h1>The server is working correctly</h1>
            </div>
        `
    );
});

// Health check para verificar conexión a DB
app.get('/health', async (req, res) => {
    const dbStatus =
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString(),
    });
});

app.use((req, res) => {
    res.status(404).json({ mensaje: 'Recurso no encontrado' });
});

// INICIAR SERVIDOR SOLO DESPUÉS DE CONECTAR A LA BASE DE DATOS
async function startServer() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await connectDB();
        console.log('✅ MongoDB conectado, iniciando servidor...\n');

        server.listen(PORT, () => {
            console.log('\n');
            console.log(
                '#######################################################################################'
            );
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📅 ${new Date()}`);
            console.log(
                '#######################################################################################'
            );
            console.log('\n');
        });

        // IMPORTAR BENCHMARK DESPUÉS DE QUE TODO ESTÉ LISTO
        // Solo en desarrollo
        if (process.env.NODE_ENV !== 'production') {
            import('./benchmark.js').catch((err) => {
                console.log('⚠️  Benchmark no disponible:', err.message);
            });
        }
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Iniciar el servidor
startServer();
