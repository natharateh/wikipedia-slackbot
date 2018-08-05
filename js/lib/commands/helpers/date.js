'use strict'

const TODAY = new Date()

export const today = {
    month: `0${TODAY.getMonth() + 1}`.slice(-2),
    monthWorded: TODAY.toLocaleString('en-us', { month: 'long' }),
    day: `0${TODAY.getDate()}`.slice(-2),
    year: TODAY.getFullYear()
}

const yesterday = {
    month: today.month,
    day: `0${TODAY.getDate() - 1}`.slice(-2),
    year: today.year
}

export const date = {
    today: {
        monthDay: `${today.month}/${today.day}`,
        yearMonthDay: `${today.year}/${today.month}/${today.day}`,
        monthDayYear: `${today.month}/${today.day}/${today.year}`,
        monthDayYearWorded: `${today.month_worded} ${today.day}, ${today.year}`
    },
    yesterday: {
        monthDay: `${yesterday.month}/${yesterday.day}`,
        yearMonthDay: `${yesterday.year}/${yesterday.month}/${yesterday.day}`,
        monthDayYear: `${yesterday.month}/${yesterday.day}/${yesterday.year}`,
        monthDayYearWorded: `${yesterday.month_worded} ${yesterday.day}, ${yesterday.year}`
    }
}