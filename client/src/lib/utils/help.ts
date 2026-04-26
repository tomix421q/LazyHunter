export function dateTimmeUTCformatter(dateTime: Date) {
	const dateObject = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

	if (isNaN(dateObject.getTime())) {
		return 'Invalid Date';
	}

	const result = new Intl.DateTimeFormat('sk-Sk', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
		// timeZone: 'UTC'
	}).format(dateObject);

	return result;
}

export function dateTimmeUTCformatter2(dateTime: Date) {
	const dateObject = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

	if (isNaN(dateObject.getTime())) {
		return 'Invalid Date';
	}

	const result = new Intl.DateTimeFormat('sk-Sk', {
		day: '2-digit',
		month: '2-digit'

		// timeZone: 'UTC'
	}).format(dateObject);

	return result;
}
