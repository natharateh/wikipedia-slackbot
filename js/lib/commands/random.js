'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { RANDOM_URL } from './helpers/endpoints'
import message from '../message-defaults'

const handler = (payload, response) => {

    let options = {
        uri: RANDOM_URL,
        json: true
    }

    request(options).then((object) => {

        let title = object.displaytitle
        let title_link = object.content_urls.desktop.page
        let text = object.extract

        let attachments = [
            {
                pretext: '🎲',
                title,
                color: '#3366cc',
                text,
                title_link,
                mrkdwn_in: ['pretext']
            }
        ]

        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments)) 
    })

}

export default {
    pattern: /random/ig,
    handler
}