import axios from 'axios';
import config from '../../config/brevo.config.js';

const fetchBrevo = axios.create({
	baseURL: config.base_url,
	headers: {
		accept: 'application/json',
		'content-type': 'application/json',
		'api-key': config.api_key,
	},
});

export default fetchBrevo;
