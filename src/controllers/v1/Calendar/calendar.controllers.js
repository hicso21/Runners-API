import Calendar from '../../../db/models/Calendar.js';

export default class CalendarControllers {
	static async createEvent(req, res) {
		const body = req.body;
		try {
			const data = await Calendar.create(body);
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getEvent(req, res) {
		const { id } = req.body;
		try {
			const data = await Calendar.findById(id);
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getUserEvents(req, res) {
		const { id } = req.body;
		try {
			const data = await Calendar.find({ user_id: id });
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return res.send({
				error: true,
				data: error,
			});
		}
	}
}
