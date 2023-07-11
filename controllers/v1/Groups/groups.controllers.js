import GroupsServices from "../../../services/v1/Groups/groups.services.js";

class GroupsController {
    
    static async getGroups(req, res) {
        try {
            const groups = await GroupsServices.getAllGroups();
            res.status(200).send(groups);
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
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
                data: error
            });
        }
    }

    static async getOneGroup(req, res) {
        try {
            const { id } = req.params;
            const group = await GroupsServices.getOneGroup(id);
            res.status(200).send(group)
        }catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

    static async updateGroup(req, res) {
        try {
            const { id } = req.params;
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

    static async deleteGroup(req, res) {
        try {
            const { group_id } = req.params;
            const res = await GroupsServices.deleteGroup(group_id);
            res.status(200).send(res)
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

} 

export default GroupsController