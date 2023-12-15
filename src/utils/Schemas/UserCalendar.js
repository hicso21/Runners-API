import RoutineType from "./Routine";

const UserCalendarType = {
	description: String(),
	date: new Date().getTime(), // 'example: 1702588178834'
	routine: RoutineType,
};
