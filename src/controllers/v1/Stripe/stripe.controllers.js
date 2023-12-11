import { Stripe } from "stripe";

class StripeControllers {
	static async getPrices(req, res) {
		try {
            const stripe = new Stripe('')
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}
}

export default StripeControllers;
