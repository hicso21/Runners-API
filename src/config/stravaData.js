import { config } from 'dotenv';
config();

export default {
	client_id: process.env.strava_client_id,
	client_secret: process.env.strava_client_secret,
	refresh_token: process.env.strava_refresh_token,
	grant_type: 'authorization_code',
	base_url: 'https://www.strava.com/api/v3',
	response_type: 'code',
	redirect_uri: 'https://runners-api.onrender.com',
};
