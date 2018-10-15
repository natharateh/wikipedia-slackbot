'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { searchURL, pageSummaryURL, WIKIPEDIA_BASE_URL } from './helpers/endpoints'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'
import respondSafely from './helpers/safe-response'

const handler = (payload, response) => {

    const regex = /search\s(.*)/
    const [, match] = regex.exec(payload.text)

    let options = {
        uri: searchURL(match),
        json: true,
        headers
    }

    request(options).then((object) => {
        // Respond with 200 right away to avoid timeout
        response.status(200).end()
  
        let [page] = object.query.prefixsearch
        let title = page.title

        let options = {
            uri: pageSummaryURL(title),
            json: true
        }

        request(options).then((object) => {

            let title = object.titles.normalized
            let title_link = object.content_urls.desktop.page
            let text = object.extract
            let pretext = '🔍'
            let color = '#3366cc'
            let page_id = object.pageid
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
      
            respond(payload, response, attachments)
        }).

            catch((err) => {
                console.log(err)
                respondWithPageNotFound(match, payload, response)
            })

    }).
        catch((err) => {
            console.log(err)
            respondWithPageNotFound(match, payload, response)
        })
  
}

const respondWithPageNotFound = (match, payload, response) => {

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
}

const respond = (payload, response, attachments) => {
    let responseURL = payload.response_url
    
    respondSafely(responseURL, message(payload, attachments))
}

export default {
    pattern: /search\s/ig,
    handler
}