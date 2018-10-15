'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { RANDOM_URL } from './helpers/endpoints'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'
import respondSafely from './helpers/safe-response'

const handler = (payload, response) => {

    let options = {
        uri: RANDOM_URL,
        json: true,
        headers
    }

    request(options).then((object) => {
        // Respond with 200 right away to avoid timeout
        response.status(200).end()

        let responseURL = payload.response_url

        let title = object.titles.normalized
        let title_link = object.content_urls.desktop.page
        let text = object.extract
        let pretext = '🎲'
        let color = '#3366cc'
        let page_id = object.pageid
        let callback_id = `${payload.text}-${page_id}`

        let attachments = [
            {
                pretext,
                title,
                color,
                text,
                title_link,
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
    pattern: /random/ig,
    handler
}