import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './src/db/mongoDB.js';
import router from './src/routes/v1/index.js';
import currentVersion from './src/utils/constants/currentVersion.js';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import GlobalChats from './src/db/models/GlobalChat.js';
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
			'https://runners-desktop.vercel.app',
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'https://runners-desktop.vercel.app',
			'https://delaf.host',
			'https://desktop.delaf.host',
			'exp://hg-cet.hicso.8081.exp.direct',
		],
		methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE', 'POST', 'UPDATE', 'PUT'],
	})
);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(logger('dev'));

io.on('connection', async (socket) => {
	console.log('An user has connected!');

	socket.on('global chat', async (message, from, user_id) => {
		let result;
		try {
			console.log('newMessage => ', { message, from, user_id });
			result = await GlobalChats.create({ message, from, user_id });
			result.save();
			console.log('Result => ', result);
		} catch (error) {
			console.error(error);
			return;
		}
		io.emit('global chat', {
			...result._doc,
			createdAt: new Date(result.createdAt).getTime(),
		});
	});

	// socket.on('user chat', (msg) => {
	// 	console.log(msg);
	// 	io.emit('user chat', msg);
	// });

	socket.on('disconnect', () => {
		console.log('An user has disconnected');
	});

	if (!socket.recovered) {
		// <- recuperase los mensajes sin conexión
		try {
			//Traer los mensaje desde db
			const results = await GlobalChats.find({
				createdAt: { $gt: socket.handshake.auth.serverOffset ?? 0 },
			});
			//Enviarselo a los usuarios que se conecten
			results.forEach((item) => {
				socket.emit('global chat', item);
			});
		} catch (e) {
			console.error(e);
			return;
		}
	}
});

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

app.get('/hostname', async (req, res) => {
	res.send(`Hostname: ${req.hostname}`);
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
