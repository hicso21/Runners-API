import Calendar from '../../../db/models/Calendar.js';

export default class CalendarControllers {
    static async createUserEvents(req, res) {
        const { events } = req.body;
        try {
            const data = await Calendar.create(events);
            res.send({
                error: false,
                data,
            });
        } catch (error) {
            return res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getUserEvent(req, res) {
        const { id } = req.params;
        try {
            const data = await Calendar.findById(id);
            res.send({
                error: false,
                data,
            });
        } catch (error) {
            return res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getRaces(req, res) {
        try {
            const data = await Calendar.find({ type: 'race' });
            res.send({
                error: false,
                data,
            });
        } catch (error) {
            return res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getUserEvents(req, res) {
        const { id } = req.params;
        try {
            const data = await Calendar.find({ user_id: id });
            res.send({
                error: false,
                data,
            });
        } catch (error) {
            return res.send({
                error: true,
                data: error,
            });
        }
    }

    static async completeUserEvent(req, res) {
        const { id } = req.body;
        try {
            const data = await Calendar.findByIdAndUpdate(id, {
                $set: { completed: true },
            });
            res.send({
                error: false,
                data,
            });
        } catch (error) {
            return res.send({
                error: true,
                data: error,
            });
        }
    }

    static async deleteUserEvents(req, res) {
        const { events } = req.body;
        if (
            !Array.isArray(events) ||
            events.some((item) => typeof item != 'string')
        )
            return res.send({
                error: true,
                data: 'The body must be an array of _id',
            });
        try {
            await Calendar.deleteMany({ _id: { $in: events } });
            res.send({
                error: false,
                data: 'Events deleted successfully',
            });
        } catch (error) {
            return res.send({
                error: true,
                data: error,
            });
        }
    }
}
