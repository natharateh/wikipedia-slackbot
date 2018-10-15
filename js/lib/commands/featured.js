'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { saveOriginalMessage } from './helpers/original-message'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import respondSafely from './helpers/safe-response'

const handler = (payload, response) => {

    let options = {
        uri: feed.FEATURED_TODAY,
        json: true,
        headers
    }

    request(options).then((object) => {
        // Respond with 200 right away to avoid timeout
        response.status(200).end()

        let responseURL = payload.response_url
        
        let article = object.tfa
        let title = article.titles.normalized
        let title_link = article.content_urls.desktop.page
        let text = article.extract
        let pretext = 'Featured article for today 💫'
        let color = '#FFCC33'
        let page_id = article.pageid
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
    pattern: /featured/ig,
    handler
}