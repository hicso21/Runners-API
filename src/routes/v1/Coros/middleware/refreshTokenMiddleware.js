import fetchCoros from '../../../../utils/fetches/fetchCorosAPI.js';
import config from '../../../../config/corosData.json' assert { type: 'json' };
import RunnersServices from '../../../../services/v1/Runners/runners.services.js';

export default async function refreshTokenMiddleWare(req, res, next) {
	try {
		const { id } = req.params;
		const runner = await RunnersServices.getById(id);
		req.user = runner;
		const body = {
			client_id: config.client_id,
			refresh_token: runner.refresh_token,
			client_secret: config.client_secret,
			grant_type: 'refresh_token',
		};
		const encodedBody = Object.keys(body)
			.map((key) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(
					body[key]
				)}`;
			})
			.join('&');
		await fetchCoros.post(
			'/oauth2/refresh-token',
			encodedBody
		);
		next();
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
