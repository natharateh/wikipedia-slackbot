'use strict'

import { date } from './date'

export const WIKIPEDIA_BASE_URL = new URL('https://en.wikipedia.org/')

const API_URL = new URL('api/rest_v1/', WIKIPEDIA_BASE_URL)

const FEED_URL = new URL('feed/', API_URL.href)

export const RANDOM_URL = new URL('page/random/summary', API_URL.href)

export const pageSummaryURL = (title) => new URL(`page/summary/${title}`, API_URL.href)

export const searchURL = (searchTerm) => new URL(`w/api.php?action=query&list=prefixsearch&format=json&pslimit=1&psnamespace=0&pssearch=${searchTerm}`, WIKIPEDIA_BASE_URL.href)

export const feed = {
    FEATURED_TODAY: new URL(`featured/${date.today.yearMonthDay}`, FEED_URL.href),
    FEATURED_YESTERDAY: new URL(`featured/${date.yesterday.yearMonthDay}`, FEED_URL.href),
    ON_THIS_DAY: new URL(`onthisday/selected/${date.today.monthDay}`, FEED_URL.href)
}