'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { pageSummaryURL, WIKIPEDIA_BASE_URL } from './helpers/endpoints'
import message from '../message-defaults'

const handler = (payload, response) => {

    const regex = /search\s(.*)/
    const [, match] = regex.exec(payload.text)

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
  
        respond(payload, response, attachments)
    }).
        catch((err) => {
            console.log(err)

            let attachments = [
                {
                    pretext: `There's no Wikipedia page for ${match} 🧐`,
                    title: 'Learn how to create Wikipedia pages',
                    title_link: 'https://en.wikipedia.org/wiki/Wikipedia:How_to_create_a_page',
                    color: '#33cc99'
                },
                {
                    title: `Create a page for ${match}`,
                    title_link: `${WIKIPEDIA_BASE_URL}wiki/${match}`,
                    color: '#3366cc'
                }
            ]

            respond(payload, response, attachments)
        })
  
}

const respond = (payload, response, attachments) => {
    response.set('content-type', 'application/json')
    response.status(200).json(message(payload, attachments))  
}

export default {
    pattern: /search\s/ig,
    handler
}