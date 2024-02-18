import Groups from '../../../db/models/Groups.js';
import RunnersServices from '../Runners/runners.services.js';

export default class GroupsServices {
	static async getAllGroups() {
		try {
			const groups = await Groups.find({});
			return groups;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async postGroup(name) {
		try {
			const newGroup = await new Groups({
				name: name,
				users: [],
			});
			await newGroup.save();
			return newGroup;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async putGroup(id, data) {
		try {
			const updated = await Groups.findByIdAndUpdate(id, data);
			return updated;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getOneGroup(id) {
		try {
			const group = await Groups.findById(id);
			return group;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async deleteUserFromGroup(groupId, userId) {
		try {
			const group = await Groups.findById(groupId);
			group?.users?.filter((user) => user._id != userId);
			const updatedGroup = await Groups.findByIdAndUpdate(
				group._id,
				group
			);
			return updatedGroup;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async addUserFromGroup(groupId, userId) {
		try {
			const group = await Groups.findById(groupId);
			const runner = await RunnersServices.getById(userId);
			group?.users?.push(runner);
			const updatedGroup = await Groups.findByIdAndUpdate(
				group._id,
				group
			);
			return updatedGroup;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async deleteGroup(id) {
		try {
			const res = await Groups.findByIdAndDelete(id);
			return {
				error: false,
				data: res,
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}
