export default RoutineType = {
	name: String(),
	exercises: [
		{
			name: String(),
			type: String(),
			category: String(),
			measure: String(),
			duration: Number(),
			measurement_unit: String(),
			second_measure: String(),
			second_duration: Number(),
			second_measurement_unit: String(),
			commentary: String(),
		},
	],
	pdf: String(),
	start: Date(),
	end: Date(),
	isDraggable: Boolean(),
	completed: Boolean(),
};
