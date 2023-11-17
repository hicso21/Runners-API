import './src/db/mongoDB.js';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './src/routes/v1/index.js';
import methodOverride from 'method-override';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { config } from 'dotenv';
import currentVersion from './src/utils/constants/currentVersion.js';
config();

const PORT = process.env.PORT || 8000;
const app = express();

app.set('views', './src/views');
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'http://localhost:8000',
			'https://runners-desktop.vercel.app',
		],
		methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE', 'POST', 'UPDATE', 'PUT'],
	})
);

// Sessions
app.use(
	session({
		secret: '0x9D93Ce5B8032257c3585A6130380381E296cdd16',
		resave: true,
		saveUninitialized: false,
		unset: 'keep',
		cookie: { secure: true, expires: 86400 },
		key: 'hicso',
	})
);

// version 1 of the api routes to all brands
app.use('/api/version', (req, res) => {
	res.send('Version in use: ' + currentVersion);
});

app.use(
	'/api/v1',
	(req, res) => {
		req.href = `${req.protocol}://${req.hostname}${req.url}`;
	},
	router
);

app.get('/', async (req, res) => {
	req.session.cookie.usuario = 'hicso';
	req.session.cookie.rol = 'admin';
	req.session.cookie.visitas = req.session.cookie.visitas
		? req.session.cookie.visitas++
		: 1;
	res.send(`
		usuario => ${req.session.cookie.usuario} <br/>
		rol => ${req.session.cookie.rol} <br/>
		visitas => ${req.session.cookie.visitas} <br/>
		${JSON.stringify(req.session.cookie)}
	`);
	// res.send(`
	// 	Welcome to Runners API <br/>
	// 	We are using version ${currentVersion} at this moment ${new Date()}`);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
