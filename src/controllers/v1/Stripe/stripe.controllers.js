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
		try {
			const { amount, currency, email, name } = req.body;
			const customer = await stripe.customers.create({
				email,
				name,
			});
			const runner = await RunnersServices.getByEmail(email);
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

	static async paymentIntent(req, res) {
		const { amount, currency, email, name, payment_method } = req.body;

		try {
			const customer = await stripe.customers.create({
				email,
				name,
			});
			console.log(customer);
			const paymentIntent = await stripe.paymentIntents.create({
				amount, // Monto en centavos
				currency,
				customer: customer.id, // ID del cliente
				payment_method: null, // ID del método de pago
				confirm: true, // Confirmar el pago automáticamente
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
