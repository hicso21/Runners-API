import { Schema, model } from 'mongoose';

const calendarSchema = new Schema(
    {
        user_id: String,
        title: String,
        exercises: Array,
        activityType: String,
        routine_id: String,
        type: String, // race || routine || nutrition
        resource: Object,
        pdf: String,
        start: Date,
        end: Date,
        isDraggable: Boolean,
        allDay: Boolean,
        completed: Boolean,
        createdAt: { type: Date, default: Date.now, expires: 0 },
    },
    { timestamps: true }
);

calendarSchema.index({ end: 1 }, { expireAfterSeconds: 0 });

calendarSchema.pre('remove', async function (next) {
    const calendar = this;
    const sixDaysInMilliseconds = 6 * 24 * 60 * 60 * 1000;

    if (calendar.type === 'race' && calendar.end < Date.now()) {
        console.log('Race event past its end date, delete it')
        next();
    } else if (
        calendar.type === 'routine' &&
        calendar.start.getTime() + sixDaysInMilliseconds < Date.now()
    ) {
        console.log('Routine past expiration time (2764800 seconds), delete it')
        next();
    } else {
        console.log('Not a race past its end or a routine past expiration, prevent deletion')
        console.warn(
            `Calendar with type "${calendar.type}" and ${
                calendar.end ? 'end date' : 'createdAt'
            } not yet expired (6 days), preventing deletion.`
        );
        next(
            new Error(
                'Calendar deletion prevented due to type and date constraints'
            )
        );
    }
});

const Calendar = model('Calendar', calendarSchema);

export default Calendar;
