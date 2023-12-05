import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import { Stripe } from 'stripe';

export default class RunnersControllers {
	static async getAll(req, res) {
		try {
			const runners = await RunnersServices.getAll();
			res.status(200).send(runners);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async getById(req, res) {
		try {
			const { id } = req.params;
			const runner = await RunnersServices.getById(id);
			res.status(200).send(runner);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async newRunner(req, res) {
		try {
			const data = req.body;
			const runner = await RunnersServices.create(data);
			res.status(201).send(runner);
		} catch (error) {
			await LogsServices.create(
				'newRunner error',
				'Error when trying to create user'
			);
			res.status(404).send({
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
				return res.status(401).send({
					error: true,
					data: 'Incorrect Password.',
				});
			}
			res.status(200).send({
				error: true,
				data: 'Password is correct',
			});
		} catch (error) {
			await LogsServices.create(
				'login error',
				'Error when trying to login'
			);
			res.status(404).send({
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
			res.status(200).send(runner);
		} catch (error) {
			await LogsServices.create(
				'updateRunner error',
				'Error when trying to update user data'
			);
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteRunner(req, res) {
		try {
			const { id } = req.params;
			const runner = await RunnersServices.delete(id);
			res.status(200).send(runner);
		} catch (error) {
			await LogsServices.create(
				'deleteRunner error',
				'Error when trying to delete user data'
			);
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}
}
