import Recovery from '../../../db/models/PasswordRecovery.js';

export default class RecoveryController {
	static async verifyCode(req, res) {
		const body = req.body;
		try {
			const { data, error } = await Recovery.findOne({ code: body.code })
				.then((res) => {
					return { error: false, data: res };
				})
				.catch((error) => {
					return { error: true, data: error };
				});
			if (error) return res.status(204).send('The code is wrong');
			else return res.status(200).send(data);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}
}
