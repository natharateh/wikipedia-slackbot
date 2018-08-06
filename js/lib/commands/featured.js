'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import message from '../message-defaults'

const handler = (payload, response) => {

    let options = {
        uri: feed.FEATURED_TODAY,
        json: true
    }

    request(options).then((object) => {
  
        let article = object.tfa
        let title = article.titles.normalized
        let title_link = article.content_urls.desktop.page
        let text = article.extract

        let attachments = [
            {
                pretext: 'Featured article for today 💫',
                title,
                title_link,
                text,
                color: '#FFCC33'
            }
        ]
  
        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments))  
    })
  
}

export default {
    pattern: /featured/ig,
    handler
}