import Calendar from "../../../db/models/Calendar.js";

class CalendarServices {
    static async create(events) {
        try {
            const data = await Calendar.create(events);
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async findOneDayEvents(user_id) {
        try {
            const data = await Calendar.find({
                completed: false,
                user_id
            });
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }
}

export default CalendarServices;
