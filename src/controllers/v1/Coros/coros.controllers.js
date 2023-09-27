import CorosServices from '../../../services/v1/Coros/coros.services.js';

class CorosController {
	static async authorize(req, res) {
		try {
			const id = req.params.db_id;
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
			const { code } = req.query;
			//const response = await CorosServices.accessToken(code);
			res.send(code)
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
