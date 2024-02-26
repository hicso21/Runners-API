import RunnersServices from '../../../../services/v1/Runners/runners.services.js';
import StravaServices from '../../../../services/v1/Strava/strava.services.js';

async function refreshToken(req, res, next) {
	//code=41d6a289d2eb3fbc002dff3900b962510250b2f4
	try {
		const user_id = req.params?.id;
		const db_id = req.query?.db_id;
		const id = user_id ? user_id : db_id;
		const user_data = await RunnersServices.getById(id);
		const refresh_oauth_token = await StravaServices.refreshAuthorization(
			user_data.refresh_token
		);
		await RunnersServices.update(user_id, {
			refresh_token: refresh_oauth_token.refresh_token,
		});
		req.bearer_token = `${refresh_oauth_token.token_type} ${refresh_oauth_token.access_token}`;
		next();
	} catch (error) {
		return {
			error: true,
			content: error,
		};
	}
}

export default refreshToken;
