import CorosServices from '../../../services/v1/Coros/coros.services.js';

class CorosController {
	static async authorize(req, res) {
		try {
			const id = req.body.user_id;
			const uri = await CorosServices.oauth(id);
			res.redirect(uri);
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async manageUserCode(req, res) {
		try {
			const { code, state: user_id } = req.query;
			const res = await CorosServices.accessToken(code, user_id);
			console.log(res)
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getCompleteUser(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getData(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getZones(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getStats(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getActivities(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default CorosController;

//
