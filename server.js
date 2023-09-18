import './src/db/mongoDB.js';
import express from 'express';
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
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// version 1 of the api routes to all brands
app.use('/api/version', () => {
	res.send(currentVersion);
});
app.use('/api/v1', router);

app.get('/', async (req, res) => {
	res.send(`
		Welcome to Runners API <br/>
		We are using V1 at this moment ${new Date()}`);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
