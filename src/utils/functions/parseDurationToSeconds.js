function parseDurationToSeconds(duration) {
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	if (duration.includes('H')) {
		hours = parseInt(duration.split('H')[0].substring(2));
	}
	if (duration.includes('M')) {
		minutes = parseInt(duration.split('H')[1].split('M')[0]);
	}
	if (duration.includes('S')) {
		seconds = parseInt(duration.split('M')[1].split('S')[0]);
	}

	const totalSeconds = hours * 3600 + minutes * 60 + seconds;
	return totalSeconds;
}
