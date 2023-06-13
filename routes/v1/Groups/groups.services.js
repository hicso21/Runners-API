import Groups from "../../../db/models/Groups.js";

export default class GroupsServices {
    static async getAllGroups () {
        try {
            const groups = await Groups.find({});
            return groups;
        } catch (error) {
            return {
                error: true,
                data: error
            }
        }
    }
    static async postGroup (name) {
        try {
            const newGroup = await new Groups({
                name: name,
                users: []
            });
            newGroup.save();
            return newGroup;
        } catch (error) {
            return {
                error: true,
                data: error
            }
        }
    }
    static async getOneGroup (id) {
        try {
            const group = await Groups.findById(id);
            return group;
        } catch (error) {
            return {
                error: true,
                data: error
            }
        }
    }
    static async deleteGroup (name) {
        try {
            await Groups.deleteOne({ name: name });
            return {
                error: false
            }
        } catch (error) {
            return {
                error: true,
                data: error
            }
        }
    }
}