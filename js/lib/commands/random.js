'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { RANDOM_URL } from './helpers/endpoints'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'

const handler = (payload, response) => {

    let options = {
        uri: RANDOM_URL,
        json: true,
        headers
    }

    request(options).then((object) => {

        let title = object.titles.normalized
        let title_link = object.content_urls.desktop.page
        let text = object.extract
        let pretext = '🎲'
        let color = '#3366cc'
        let callback_id = payload.text

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

        saveOriginalMessage(payload, callback_id, originalMessage)

        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments)) 
    })

}

export default {
    pattern: /random/ig,
    handler
}