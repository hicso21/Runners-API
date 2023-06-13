import GroupsServices from "./groups.services.js";

class GroupsController {
    
    static async getGroups(req, res) {
        try {
            const groups = await GroupsServices.getAllGroups();
            res.status(200).send(groups);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async newGroup(req, res) {
        try {
            const { name } = req.body;
            const newGroup = await GroupsServices.postGroup(name);
            res.status(201).send(newGroup);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async getOneGroup(req, res) {
        try {
            const { id } = req.params;
            const group = await GroupsServices.getOneGroup(id);
            res.status(200).send(group)
        }catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async updateGroup(req, res) {
        try {
            const { id } = req.params;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async deleteGroup(req, res) {
        try {
            const { name } = req.body;
            const res = await GroupsServices.deleteGroup(name);
            res.status(200).send(res)
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

} 

export default GroupsController