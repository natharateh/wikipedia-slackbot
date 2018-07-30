'use strict'

const TODAY = new Date()

const constants = {
    FEED_ENDPOINT: 'https://en.wikipedia.org/api/rest_v1/feed/',
    WIKIPEDIA_BASE_URL: 'https://en.wikipedia.org/wiki/'
}

const today = {
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

const feed = {
    FEATURED: `${constants.FEED_ENDPOINT}featured/${date.year_month_day}`,
    ON_THIS_DAY: `${constants.FEED_ENDPOINT}onthisday/selected/${date.month_day}`
}

export default {
    today,
    WIKIPEDIA_BASE_URL: constants.WIKIPEDIA_BASE_URL,
    feed
}