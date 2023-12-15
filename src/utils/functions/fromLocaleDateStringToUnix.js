export default function fromLocaleDateStringToUnix(localeDateString) {
	const separatedDate = localeDateString.split('/');
	const day = parseInt(separatedDate[0]);
	const month = parseInt(separatedDate[1]);
	const year = parseInt(separatedDate[2]);
	const timestamp = new Date(year, month - 1, day).getTime();
	return timestamp;
}
