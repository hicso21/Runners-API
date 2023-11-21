import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import './src/db/mongoDB.js';
import session from 'express-session';
import flash from 'connect-flash';
import router from './src/routes/v1/index.js';
import currentVersion from './src/utils/constants/currentVersion.js';
config();

const PORT = process.env.PORT || 8000;
const app = express();

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
app.use(
	session({
		secret: 'hicso',
		saveUninitialized: true,
		resave: true,
	})
);

// version 1 of the api routes to all brands
app.use('/api/version', (req, res) => {
	res.send('Version in use: ' + currentVersion);
});

app.use(
	'/api/v1',
	(req, res, next) => {
		req.href = `${req.protocol}://${req.hostname}`;
		next();
	},
	router
);

app.get('/', async (req, res) => {
	res.send(`
		Welcome to Runners API <br/>
		We are using version ${currentVersion} at this moment ${new Date()}`);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
