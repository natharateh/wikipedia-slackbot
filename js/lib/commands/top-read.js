'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'
import respondSafely from './helpers/safe-response'

const handler = (payload, response) => {
    request(options(feed.FEATURED_TODAY)).then((object) => {
        respond(payload, response, object) 
    }).
        catch((err) => {
            console.log(err)

            request(options(feed.FEATURED_YESTERDAY)).then((object) => {
                respond(payload, response, object)
            })
        })
}

const options = (uri) => ({
    uri,
    json: true,
    headers
})

const respond = (payload, response, object) => {
    // Respond with 200 right away to avoid timeout
    response.status(200).end()

    let responseURL = payload.response_url

    let articles = object.mostread.articles
    let [article] = articles
    let title = article.titles.normalized
    let title_link = article.content_urls.desktop.page
    let text = article.extract
    let pretext = 'Top read today 📈'
    let color = '#3366cc'
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
}

export default {
    pattern: /top\sread/ig,
    handler
}