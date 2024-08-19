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
import './src/db/mongoDB.js';
import router from './src/routes/v1/index.js';
import currentVersion from './src/utils/constants/currentVersion.js';
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
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
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

sockets(io);

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

app.get('/test', (req, res) => res.end());

app.get('/', async (req, res) => {
    res.send(`
		Welcome to Runners API <br/>
		We are using version ${currentVersion} at this moment ${new Date()}`);
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

server.listen(PORT, () => {
    console.log('\n');
    console.log(
        '#######################################################################################'
    );
    console.log(`Server running on port ${PORT}`);
});
