import Routines from '../../../db/models/Routines.js';

export default class RoutinesServices {
	static async getAllRoutines() {
		try {
			const routines = await Routines.find({});
			return routines;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async postRoutine(name) {
		try {
			const newRoutine = await new Routines({
				name: name,
				exercises: [],
			});
			await newRoutine.save();
			return newRoutine;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getOneRoutine(id) {
		try {
			const routine = await Routines.findById(id);
			return routine;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async updateRoutine(id, routine) {
		try {
			const routineUpdated = await Routines.findByIdAndUpdate(
				id,
				routine,
				{ new: true }
			);
			return routineUpdated;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async deleteRoutine(id) {
		try {
			await Routines.findByIdAndDelete(id);
			return {
				error: false,
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}
