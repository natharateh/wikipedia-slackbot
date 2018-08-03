'use strict'

import { date } from './date'

export const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/'

const API_URL = `${WIKIPEDIA_BASE_URL}api/rest_v1/`

const FEED_URL = `${API_URL}feed/`

export const RANDOM = `${API_URL}page/random/title`

export const feed = {
    FEATURED: `${FEED_URL}featured/${date.yearMonthDay}`,
    ON_THIS_DAY: `${FEED_URL}onthisday/selected/${date.monthDay}`
}