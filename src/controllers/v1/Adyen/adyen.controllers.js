import Adyen from '@adyen/api-library';
import config from '../../../config/adyen.config.js';
import fetchAdyen from '../../../utils/fetches/fetchAdyen.js';
import axios from 'axios';

class AdyenControllers {
	static async makePayment(req, res) {
		const body = req.body;
		// try {
		// const { data } = await axios.get(
		// 	'https://checkout-test.adyen.com/v71/storedPaymentMethods',
		// 	// {
		// 	// 	amount: {
		// 	// 		currency: 'USD',
		// 	// 		value: 50,
		// 	// 	},
		// 	// 	merchantAccount: config.test.merchantAccount,
		// 	// 	reference: Date.now(),
		// 	// },
		// 	{
		// 		'content-type': 'application/json',
		// 		'x-API-key': config.test.apikey,
		// 	}
		// );
		// res.send(data);
		const configuration = new Adyen.Config();
		configuration.apiKey = config.test.apikey;
		configuration.merchantAccount = config.test.merchantAccount;
		const client = new Adyen.Client({ configuration });
		client.setEnvironment('TEST');
		const checkout = new Adyen.CheckoutAPI(client);
		const paymentsResponse = checkout.PaymentsApi.paymentMethods({
			merchantAccount: configuration.merchantAccount,
			countryCode: 'NL',
			shopperLocale: 'nl-NL',
			amount: { currency: 'EUR', value: 1000 },
			channel: 'Android',
		});
		// res.send({ error: false, data: paymentsResponse });
		// } catch (error) {
		// 	res.send({
		// 		error: true,
		// 		data: error,
		// 	});
		// }
	}

	static async webhook(req, res) {
		const body = req.body;
		console.log(body);
		res.send(body);
	}
}

export default AdyenControllers;
