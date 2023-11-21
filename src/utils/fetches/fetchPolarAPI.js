import axios from 'axios';
import config from '../../config/polarData.json' assert { type: 'json' };

const fetchPolar = axios.create({
	baseURL: config.base_url,
	headers: {
		Accept: 'application/json',
		Authorization: `Basic ${btoa(
			`${config.client_id}:${config.client_secret}`
		)}`,
	},
});

export default fetchPolar;
