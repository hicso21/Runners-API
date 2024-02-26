import { config } from 'dotenv';
config();

export default {
	client_id: process.env.suunto_client_id,
	client_secret: process.env.suunto_client_secret,
	base_url: 'https://cloudapi-oauth.suunto.com',
	response_type: 'code',
	oauth_endpoint: '',
	redirect_uri: 'https://juandelaf.com/',
};
