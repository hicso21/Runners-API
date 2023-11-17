import Logs from '../../../db/models/Logs.js';

export default class LogsServices {
	static async create(name, description, date) {
		try {
			const logs = new Logs({ name, description, date });
			await logs.save();
			return {
				error: false,
				data: logs,
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getAll() {
		try {
			const logs = Logs.find({});
			return {
				error: false,
				data: logs,
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getById(id) {
		try {
			const log = Logs.findById(id);
			return {
				error: true,
				data: log,
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}
