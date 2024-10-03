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
        expirationDate: { type: Date, index: { expires: '0s' } },
    },
    { timestamps: true }
);

calendarSchema.pre('save', function (next) {
    const now = new Date();
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

    if (this.type === 'race') {
        if (this.start < now) {
            // Si es una carrera pasada, establecemos expirationDate a ahora
            this.expirationDate = now;
        } else {
            // Si es una carrera futura, establecemos expirationDate a la fecha de inicio
            this.expirationDate = this.start;
        }
    } else if (this.type === 'routine') {
        if (this.start < sixDaysAgo) {
            // Si es una rutina con más de 6 días de antigüedad, establecemos expirationDate a ahora
            this.expirationDate = now;
        } else {
            // Si es una rutina más reciente, establecemos expirationDate a 6 días después de su inicio
            this.expirationDate = new Date(
                this.start.getTime() + 6 * 24 * 60 * 60 * 1000
            );
        }
    } else {
        // Para otros tipos, no establecemos expirationDate
        this.expirationDate = undefined;
    }
    next();
});

const Calendar = model('Calendar', calendarSchema);

export default Calendar;
