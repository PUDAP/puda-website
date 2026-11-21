
import React from 'react'

// Formatted in UTC so the server render and the browser always agree on the day.
function FormattedDate({ date }: { date: string }) {
	const _date = new Date(date)
	return (
		<time dateTime={_date.toISOString()}>
			{_date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC',
			})}
		</time>
	)
}

export default FormattedDate



