'usee strict'

import { date } from './date'

export const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/'

const API_URL = `${WIKIPEDIA_BASE_URL}api/rest_v1/`

const FEED_URL = `${API_URL}feed/`

export const RANDOM_URL = `${API_URL}page/random/summary`

export const pageSummaryURL = (title) => encodeURI(`${API_URL}page/summary/${title}`)

export const searchURL = (searchTerm) => `${WIKIPEDIA_BASE_URL}w/api.php?action=query&list=prefixsearch&format=json&pslimit=1&psnamespace=0&pssearch=${searchTerm}`

export const feed = {
    FEATURED_TODAY: `${FEED_URL}featured/${date.today.yearMonthDay}`,
    FEATURED_YESTERDAY: `${FEED_URL}featured/${date.yesterday.yearMonthDay}`,
    ON_THIS_DAY: `${FEED_URL}onthisday/selected/${date.today.monthDay}`
}
