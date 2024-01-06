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
import encrypt from './src/utils/functions/encrypt.js';
import decrypt from './src/utils/functions/decrypt.js';
// import pdf from './src/utils/terms&conditions';
config();

const PORT = process.env.PORT || 8080;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, 'public/pdfs');

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
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', 'https://delaf.host');
// 	res.header('Access-Control-Allow-Origin', 'https://desktop.delaf.host');
// 	res.header(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept'
// 	);
// 	next();
// });

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

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
