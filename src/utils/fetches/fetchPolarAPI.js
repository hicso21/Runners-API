import axios from 'axios';
import config from '../../config/polarData.js';

const data = `${config.client_id}:${config.client_secret}`;
const buffer = Buffer.from(data, 'utf8');
const encodedString = buffer.toString('base64');

const fetchPolar = axios.create({
	baseURL: config.base_url,
	headers: {
		Accept: 'application/json',
		Authorization: `Basic ${encodedString}`,
	},
});

export default fetchPolar;
