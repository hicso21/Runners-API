import RoutinesServices from '../../../services/v1/Routines/routines.services.js';

class RoutinesController {
	static async getRoutines(req, res) {
		try {
			const routines = await RoutinesServices.getAllRoutines();
			res.status(200).send(routines);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async newRoutine(req, res) {
		try {
			const { name } = req.body;
			const exercises = [
				{
					name: 'Calentamiento basico',
					type: 'heating',
					category: 'heating',
					measure: 'sec',
					duration: 900,
					measurement_unit: 'sec',
					commentary: '',
				},
				{
					name: 'Carrera basica',
					type: 'race',
					category: 'frequency_running',
					measure: 'km',
					duration: 10,
					measurement_unit: 'km',
					commentary: '',
				},
				{
					name: 'Enfriamiento basico',
					type: 'cooling',
					category: 'cooling',
					measure: 'sec',
					duration: 900,
					measurement_unit: 'sec',
					commentary: '',
				},
			];
			const newRoutine = await RoutinesServices.postRoutine(
				name,
				exercises
			);
			res.status(201).send(newRoutine);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async getOneRoutine(req, res) {
		try {
			const { id } = req.params;
			const routine = await RoutinesServices.getOneRoutine(id);
			res.status(200).send(routine);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async updateRoutine(req, res) {
		try {
			const { id } = req.params;
			const routine = req.body;
			const updatedRoutine = await RoutinesServices.updateRoutine(
				id,
				routine
			);
			res.status(200).send(updatedRoutine);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteRoutine(req, res) {
		try {
			const { id } = req.params;
			await RoutinesServices.deleteRoutine(id);
			res.status(200).send({
				error: false,
				data: 'Routine deleted correctly',
			});
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}
}

export default RoutinesController;
