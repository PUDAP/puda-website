
import React from 'react'

function FormattedDate({ date }: { date: string }) {
	const _date = new Date(date)
	return (
		<time dateTime={_date.toISOString()}>
			{`${_date.getDate()} ${_date.toLocaleDateString('en-us', { month: 'short' })}, ${_date.getFullYear()}`}
		</time>
	)
}

export default FormattedDate



