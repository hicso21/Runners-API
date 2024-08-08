import Calendar from '../../../db/models/Calendar';

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

    static async getUserEvent() {}
}

export default CalendarServices;
