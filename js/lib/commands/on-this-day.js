'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { today } from './helpers/date'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'
import respondSafely from './helpers/safe-response'

const handler = (payload, response) => {

    let options = {
        uri: feed.ON_THIS_DAY,
        json: true,
        headers
    }

    request(options).then((object) => {
        // Respond with 200 right away to avoid timeout
        response.status(200).end()

        let responseURL = payload.response_url

        let selected = object.selected
        let event = selected[Math.floor(Math.random() * selected.length)]
        let pages = event.pages
        let random = Math.floor(Math.random() * pages.length)
        let page = pages[random]
        let title = page.titles.normalized
        let title_link = page.content_urls.desktop.page
        let text = page.extract
        let years_ago = `🗓 ${today.year - event.year} years ago: ${event.text}`
        let pretext = years_ago
        let color = '#3366cc'
        let page_id = page.pageid
        let callback_id = `${payload.text}-${page_id}`

        let attachments = [
            {
                pretext,
                title,
                title_link,
                text,
                color,
                callback_id,
                actions
            }
        ]

        const originalMessage = {
            pretext,
            title,
            title_link,
            text,
            color 
        }

        saveOriginalMessage(callback_id, originalMessage)
        respondSafely(responseURL, message(payload, attachments))
    })

}

export default {
    pattern: /on\sthis\sday/ig,
    handler
}