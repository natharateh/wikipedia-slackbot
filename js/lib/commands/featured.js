'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed, WIKIPEDIA_BASE_URL } from '../helpers'
import message from 'message-defaults'

const handler = (payload, response) => {

    let options = {
        uri: feed.FEATURED,
        json: true
    }

    request(options).then((object) => {
  
        let article = object.tfa
        let title = article.title
  
        let attachments = [
            {
                pretext: 'Featured article for today 💫',
                title,
                title_link: `${WIKIPEDIA_BASE_URL}${title}`,
                text: article.extract,
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