import Runners from '../../../db/models/Runners.js';

export default class RunnersServices {
	static async getAll() {
		try {
			const runners = await Runners.find({});
			return runners;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getById(id) {
		try {
			const runner = await Runners.findById(id);
			return runner;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getByEmail(email) {
		try {
			const runner = await Runners.findOne({ email });
			return runner;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async changePassword(id, newPassword) {
		try {
			const updatedRunner = await Runners.findByIdAndUpdate(
				id,
				{ $set: { password: newPassword } },
				{ new: true }
			);
			return updatedRunner;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async create(runner) {
		try {
			const newRunner = new Runners(runner);
			await newRunner.save();
			return newRunner;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async update(id, runner) {
		try {
			const res = await Runners.findByIdAndUpdate(id, runner);
			return {
				error: false,
				runner: res,
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async delete(id) {
		try {
			await Runners.findByIdAndDelete(id);
			return 'User deleted successfully.';
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}
