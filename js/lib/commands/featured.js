'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { saveOriginalMessage } from './helpers/original-message'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'

const handler = (payload, response) => {

    let options = {
        uri: feed.FEATURED_TODAY,
        json: true,
        headers
    }

    request(options).then((object) => {
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

        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments))  
    })
  
}

export default {
    pattern: /featured/ig,
    handler
}