import RoutineType from './Routine';

export default UserCalendarType = {
	description: String(),
	date: new Date().getTime(), // 'example: 1702588178834'
	routine: RoutineType,
	races: Array(),
};
