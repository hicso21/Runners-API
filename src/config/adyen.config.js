import { config } from 'dotenv';
config();

export default {
	base_url: 'https://checkout-test.adyen.com',
	test: {
		webhookHMAC: process.env.adyen_webhook_hmac,
		apikey: process.env.adyen_api_key,
		clientKey: process.env.adyen_client_key,
		merchantAccount: process.env.adyen_merchant_account
	},
};
