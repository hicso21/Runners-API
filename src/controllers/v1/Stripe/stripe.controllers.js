import { Stripe } from 'stripe';
import config from '../../../config/stripe.js';

class StripeControllers {
	static async getPrices(req, res) {
		try {
			const stripe = new Stripe(config.development_key);
			const prices = await stripe.prices.list();
			const sortedPrices = prices.data.sort(
				(a, b) => a.unit_amount - b.unit_amount
			);
			res.send(prices.data);
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async checkout(req, res) {
		const { price_id } = req.body;
		try {
			const stripe = new Stripe(config.development_key);
			const session = await stripe.checkout.sessions.create({
				mode: 'subscription',
				payment_method_types: ['card'],
				line_items: [{ price: price_id }],
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
