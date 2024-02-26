import { config } from 'dotenv';
config();

export default {
	baseUrl: 'https://api.stripe.com',
	production: {
		publishable_key: process.env.stripe_production_publishable_key,
		secret_key: process.env.stripe_production_secret_key,
	},
	development: {
		publishable_key: process.env.stripe_development_publishable_key,
		secret_key: process.env.stripe_development_secret_key,
	},
};
