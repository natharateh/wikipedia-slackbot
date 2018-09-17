'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { today } from './helpers/date'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'

const handler = (payload, response) => {

    let options = {
        uri: feed.ON_THIS_DAY,
        json: true,
        headers
    }

    request(options).then((object) => {

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
        let callback_id = payload.text

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

        saveOriginalMessage(payload, callback_id, originalMessage)

        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments))
    })

}

export default {
    pattern: /on\sthis\sday/ig,
    handler
}