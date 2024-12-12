export default function polarDurationParse(duration) {
    let totalSeconds = 0;

    const hoursMatch = duration.match(/(\d+)H/);
    if (hoursMatch) totalSeconds += parseInt(hoursMatch[1]) * 3600;

    const minutesMatch = duration.match(/(\d+)M/);
    if (minutesMatch) totalSeconds += parseInt(minutesMatch[1]) * 60;

    const secondsMatch = duration.match(/(\d+(?:\.\d+)?)S/);
    if (secondsMatch) totalSeconds += Math.floor(parseFloat(secondsMatch[1]));

    return totalSeconds;
}
