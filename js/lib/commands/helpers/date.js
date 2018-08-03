'use strict'

const TODAY = new Date()

export const today = {
    month: `0${TODAY.getMonth() + 1}`.slice(-2),
    monthWorded: TODAY.toLocaleString('en-us', { month: 'long' }),
    day: `0${TODAY.getDate()}`.slice(-2),
    year: TODAY.getFullYear()
}

export const date = {
    monthDay: `${today.month}/${today.day}`,
    yearMonthDay: `${today.year}/${today.month}/${today.day}`,
    monthDayYear: `${today.month}/${today.day}/${today.year}`,
    monthDayYearWorded: `${today.month_worded} ${today.day}, ${today.year}`
}