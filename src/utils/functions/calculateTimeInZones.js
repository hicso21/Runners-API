export default function calculateTimeInZones(birthDate, heartRateData) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    const fcm = Math.round(208 - 0.7 * age);

    const zones = [
        {
            zone: 1,
            name: 'Recuperación activa',
            min: fcm * 0.5,
            max: fcm * 0.6,
            time_in_zone: 0,
        },
        {
            zone: 2,
            name: 'Resistencia base',
            min: fcm * 0.6,
            max: fcm * 0.7,
            time_in_zone: 0,
        },
        {
            zone: 3,
            name: 'Aeróbico',
            min: fcm * 0.7,
            max: fcm * 0.8,
            time_in_zone: 0,
        },
        {
            zone: 4,
            name: 'Umbral anaeróbico',
            min: fcm * 0.8,
            max: fcm * 0.9,
            time_in_zone: 0,
        },
        {
            zone: 5,
            name: 'Máximo esfuerzo',
            min: fcm * 0.9,
            max: fcm,
            time_in_zone: 0,
        },
    ];

    let timestamp;

    heartRateData.forEach((hr, index) => {
        const zone = zones.find((z) => hr >= z.min && hr <= z.max);
        if (zone) {
            if (index < heartRateData.length - 1) {
                zone.time_in_zone += 4;
            }
        }
    });

    return zones.map((z) => ({
        zone: z.zone,
        time_in_zone: z.time_in_zone,
    }));
}
