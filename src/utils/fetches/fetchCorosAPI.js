import axios from 'axios';
import config from '../../config/corosData.js';

const fetchCoros = axios.create({
	baseURL: config.base_url,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
});

export default fetchCoros;
