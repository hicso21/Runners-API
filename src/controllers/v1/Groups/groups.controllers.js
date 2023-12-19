import GroupsServices from '../../../services/v1/Groups/groups.services.js';

class GroupsController {
	static async getGroups(req, res) {
		try {
			const groups = await GroupsServices.getAllGroups();
			res.status(200).send(groups);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async newGroup(req, res) {
		try {
			const { name } = req.body;
			const newGroup = await GroupsServices.postGroup(name);
			res.status(201).send(newGroup);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async updateGroup(req, res) {
		try {
			const { id } = req.params;
			const data = req.body;
			const newGroup = await GroupsServices.putGroup(id, data);
			res.status(201).send(newGroup);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async getOneGroup(req, res) {
		try {
			const { id } = req.params;
			const group = await GroupsServices.getOneGroup(id);
			res.status(200).send(group);
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteGroup(req, res) {
		try {
			const { id } = req.params;
			await GroupsServices.deleteGroup(id);
			res.status(200).send({
				error: false,
				date: 'The group has been deleted successfully',
			});
		} catch (error) {
			res.status(404).send({
				error: true,
				data: error,
			});
		}
	}
}

export default GroupsController;
