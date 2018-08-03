'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed, WIKIPEDIA_BASE_URL } from './helpers/endpoints'
import { today } from './helpers/date'
import message from '../message-defaults'

const handler = (payload, response) => {

    let options = {
        uri: feed.ON_THIS_DAY,
        json: true
    }

    request(options).then((object) => {

        let selected = object.selected
        let event = selected[Math.floor(Math.random() * selected.length)]
        let pages = event.pages
        let text = event.text
        let random = Math.floor(Math.random() * pages.length)
        let title = pages[random].normalizedtitle
        let summary = pages[random].extract
        let years_ago = `🗓 ${today.year - event.year} years ago: ${text}`

        let attachments = [
            {
                pretext: years_ago,
                title,
                title_link: WIKIPEDIA_BASE_URL + title,
                text: summary,
                color: '#3366cc'
            }
        ]

        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments))
    })

}

export default {
    pattern: /on\sthis\sday/ig,
    handler
}