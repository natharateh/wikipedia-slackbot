'use strict'

/* eslint-disable camelcase */


import request from 'es6-request'
import { feed, WIKIPEDIA_BASE_URL } from '../helpers'

const handler = (payload, res) => {

    request.get(feed.FEATURED).then(([body]) => {
  
        let object = JSON.parse(body)
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
