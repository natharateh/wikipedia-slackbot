'use strict'

/* eslint-disable camelcase */


import request from 'request-promise-native'
import { feed, WIKIPEDIA_BASE_URL } from '../helpers'

const handler = (payload, res) => {

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
  
        let msg = {
            response_type: 'in_channel',
            channel: payload.channel_name,
            attachments
        }
  
        res.set('content-type', 'application/json')
        res.status(200).json(msg)  
    })
  
}

export default {
    pattern: /featured/ig,
    handler
}