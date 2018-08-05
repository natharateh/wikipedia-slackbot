'use strict'

import { date } from './date'

export const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/'

const API_URL = `${WIKIPEDIA_BASE_URL}api/rest_v1/`

const FEED_URL = `${API_URL}feed/`

export const RANDOM_URL = `${API_URL}page/random/summary`

export const feed = {
    FEATURED_TODAY: `${FEED_URL}featured/${date.today.yearMonthDay}`,
    FEATURED_YESTERDAY: `${FEED_URL}featured/${date.yesterday.yearMonthDay}`,
    ON_THIS_DAY: `${FEED_URL}onthisday/selected/${date.today.monthDay}`
}