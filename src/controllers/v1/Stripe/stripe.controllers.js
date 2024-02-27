import { Stripe } from 'stripe';
import config from '../../../config/stripe.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
const stripe = new Stripe(config.development.secret_key);

class StripeControllers {
	static async getPrices(req, res) {
		try {
			const prices = await stripe.prices.list();
			const sortedPrices = prices.data.sort(
				(a, b) => a.unit_amount - b.unit_amount
			);
			res.send(sortedPrices);
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async getCustomers(req, res) {
		try {
			const customers = await stripe.customers.list();
			const sortedCustomers = customers.data.sort(
				(a, b) => a.unit_amount - b.unit_amount
			);
			res.send(sortedCustomers);
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async paymentSheet(req, res) {
		let customer;
		try {
			const { amount, currency, email, name } = req.body;
			const runner = await RunnersServices.getByEmail(email);
			if (!runner?.stripe_id) {
				customer = await stripe.customers.create({
					email,
					name,
				});
			} else {
				const res = await stripe.customers.search({
					query: `email:"${email}" name:"${name}"`,
				});
				customer = res.data[0];
			}
			if (runner?._id)
				RunnersServices.update(runner._id, {
					...runner,
					stripe_id: customer.id,
				});
			// const ephemeralKey = await stripe.ephemeralKeys.create({
			// 	customer: customer.id,
			// });
			const paymentIntent = await stripe.paymentIntents.create({
				amount: amount,
				currency: currency,
				customer: customer.id,
				automatic_payment_methods: {
					enabled: true,
				},
			});
			console.log({
				paymentIntent: paymentIntent.client_secret,
				// ephemeralKey: ephemeralKey.secret,
				customer: customer.id,
				publishableKey: config.development.publishable_key,
			});
			res.json({
				paymentIntent: paymentIntent.client_secret,
				// ephemeralKey: ephemeralKey.secret,
				customer: customer.id,
				publishableKey: config.development.publishable_key,
			});
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteCustomers(req, res) {
		const { customers } = req.body;
		try {
			customers.map(async (customer) => {
				await stripe.customers.del(customer.id);
			});
			res.send('ok');
		} catch (error) {
			console.log(error);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async getCustomers(req, res) {
		const { email, name } = req.body;
		try {
			let data;
			if (!(email && name)) {
				const res = await stripe.customers.list();
				data = res.data;
			} else {
				const res = await stripe.customers.search({
					query: `email:"${email}" name:"${name}"`,
				});
				data = res.data[0];
			}
			res.send(data);
		} catch (error) {
			console.log(error);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async paymentIntent(req, res) {
		const { amount, currency, email, name, payment_method } = req.body;
		let customer;
		try {
			const res = await stripe.customers.search({
				query: `email:"${email}" name:"${name}"`,
			});
			customer = res.data[0];
			if (!customer?.id) {
				const newCustomer = await stripe.customers.create({
					email,
					name,
				});
				customer = newCustomer;
			}
			console.log(customer);
			const paymentIntent = await stripe.paymentIntents.create({
				amount,
				currency,
				customer: customer.id,
				confirm: true,
				payment_method: 'card',
				automatic_payment_methods: {
					enabled: true,
				},
				return_url: 'https://delaf.click',
			});
			console.log(paymentIntent);
			res.send(paymentIntent);
		} catch (error) {
			console.log(error);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async checkout(req, res) {
		const { price_id } = req.body;
		try {
			const session = await stripe.checkout.sessions.create({
				billing_address_collection: 'auto',
				line_items: [{ price: price_id, quantity: 1 }],
				mode: 'subscription',
				success_url: 'success',
				cancel_url: 'cancel',
			});
			res.send(session.url);
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}
}

export default StripeControllers;
