import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import { Stripe } from 'stripe';

export default class RunnersControllers {
	static async getAll(req, res) {
		try {
			const runners = await RunnersServices.getAll();
			res.status(200).send({ error: false, data: runners });
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async getById(req, res) {
		try {
			const { id } = req.params;
			const runner = await RunnersServices.getById(id);
			res.status(200).send({ error: false, data: runner });
		} catch (error) {
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async newRunner(req, res) {
		try {
			const data = req.body;
			const runner = await RunnersServices.create(data);
			res.status(201).send({ error: false, data: runner });
		} catch (error) {
			await LogsServices.create(
				'newRunner error',
				'Error when trying to create user'
			);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;
			const runner = await RunnersServices.getByEmail(email);
			if (runner.password !== password) {
				return res.status(400).send({
					error: true,
					data: 'Incorrect Password.',
				});
			}
			res.status(200).send({
				error: false,
				data: runner,
			});
		} catch (error) {
			await LogsServices.create(
				'login error',
				'Error when trying to login'
			);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async updateRunner(req, res) {
		try {
			const { id } = req.params;
			const data = req.body;
			const runner = await RunnersServices.update(id, data);
			res.status(200).send({ error: false, data: runner });
		} catch (error) {
			await LogsServices.create(
				'updateRunner error',
				'Error when trying to update user data'
			);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteRunner(req, res) {
		try {
			const { id } = req.params;
			const runner = await RunnersServices.delete(id);
			res.status(200).send({ error: false, data: runner });
		} catch (error) {
			await LogsServices.create(
				'deleteRunner error',
				'Error when trying to delete user data'
			);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async updateRoutine(req, res) {
		try {
			const { id } = req.params;
			const { date, routine } = req.body;
			const runner = await RunnersServices.getById(id);
			const newRoutine = { date, routine };
			if (runner.calendar.some((item) => item.date == date)) {
				const filteredCalendar = runner.calendar.filter(
					(item) => item.date != date
				);
				const updatedCalendar = filteredCalendar.push(newRoutine);
				runner.calendar = updatedCalendar;
			} else {
				const updatedCalendar = runner.calendar.push(newRoutine);
				runner.calendar = updatedCalendar;
			}
			const updatedRunner = await RunnersServices.update(id, runner);
			res.send({ error: false, data: updatedRunner });
		} catch (error) {
			await LogsServices.create(
				'updateRoutine error',
				'Error when trying to find or update user'
			);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}

	static async updateCalendar(req, res) {
		try {
			const { id } = req.params;
			const runner = req.body;
			const updatedRunner = await RunnersServices.update(id, runner);
			res.send({
				error: false,
				data: updatedRunner,
			});
		} catch (error) {
			await LogsServices.create(
				'updateCalendar error',
				'Error when trying to find or update user'
			);
			res.status(500).send({
				error: true,
				data: error,
			});
		}
	}
}
