'use strict'

const TODAY = new Date()

const FEED_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/feed/'

export const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/wiki/'

export const today = {
    month: `0${TODAY.getMonth() + 1}`.slice(-2),
    monthWorded: TODAY.toLocaleString('en-us', { month: 'long' }),
    day: `0${TODAY.getDate()}`.slice(-2),
    year: TODAY.getFullYear()
}

const date = {
    monthDay: `${today.month}/${today.day}`,
    yearMonthDay: `${today.year}/${today.month}/${today.day}`,
    monthDayYear: `${today.month}/${today.day}/${today.year}`,
    monthDayYearWorded: `${today.month_worded} ${today.day}, ${today.year}`
}

export const feed = {
    FEATURED: `${FEED_ENDPOINT}featured/${date.year_month_day}`,
    ON_THIS_DAY: `${FEED_ENDPOINT}onthisday/selected/${date.month_day}`
}