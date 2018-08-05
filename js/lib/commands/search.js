'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { pageSummaryURL } from './helpers/endpoints'
import message from '../message-defaults'

const handler = (payload, response) => {

    const regex = /search\s(.*)/
    const [match] = regex.exec(payload.text)

    let options = {
        uri: pageSummaryURL(match),
        json: true
    }

    request(options).then((object) => {
  
        let title = object.titles.normalized
        let title_link = object.content_urls.desktop.page
        let text = object.extract

        let attachments = [
            {
                pretext: '🔍',
                title,
                title_link,
                text,
                color: '#3366cc'
            }
        ]
  
        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments))  
    })
  
}

export default {
    pattern: /search\s/ig,
    handler
}