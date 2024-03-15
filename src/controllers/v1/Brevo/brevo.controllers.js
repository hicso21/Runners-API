import config from '../../../config/brevo.config.js';
import Recovery from '../../../db/models/PasswordRecovery.js';
import Runners from '../../../db/models/Runners.js';
import fetchBrevo from '../../../utils/fetches/fetchBrevo.js';
import generateCode from '../../../utils/functions/generateSixNumberCode.js';

class BrevoControllers {
	static async recoveryPasswordMail(req, res) {
		const body = req.body;
		const url = `/v3/smtp/templates/${config.recovery_template_id}/sendTest`;
		const code = generateCode();
		console.log(body)
		try {
			const { data, error } = await Runners.findOne({ email: body.to })
				.then((res) => {
					return {
						error: false,
						data: res,
					};
				})
				.catch((error) => {
					return {
						error: true,
						data: error,
					};
				});
			console.log(data)
			if (error)
				return res.send({
					error: true,
					data: "This email doesn't exist",
				});
			await Recovery.create({
				code,
				user_id: data._id,
				email: body.to,
			});
			await fetchBrevo.post(url, {
				emailTo: [body.to],
				params: {
					code,
				},
			});
			res.send({ error: false, data: 'Mail sended' });
		} catch (error) {
			console.log(error);
			res.send({ error: true, data: error });
		}
	}

	static async createContact(req, res) {
		const body = req.body;
		const url = `/v3/contacts`;
		try {
			const { data } = await fetchBrevo.post(url, {
				email: body.email,
				ext_id: body.id,
				attributes: {
					FIRSTNAME: body.firstname,
					LASTNAME: body.lastname,
				},
			});
			res.send(data);
		} catch (error) {
			res.send({ error: true, data: error });
		}
	}
}

export default BrevoControllers;
