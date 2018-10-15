'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import message from './helpers/message-defaults'
import headers from './helpers/request-headers'
import actions from './helpers/actions'
import { saveOriginalMessage } from './helpers/original-message'

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

    response.set('content-type', 'application/json')
    response.status(200).json(message(payload, attachments))  
}

export default {
    pattern: /top\sread/ig,
    handler
}