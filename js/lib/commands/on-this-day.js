'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { today } from './helpers/date'
import headers from './helpers/request-headers'
import { articleKey, attachments, message, ResponseType } from './helpers/message-defaults'
import { save } from './helpers/cache'
import { respondImmediately, respondWithDelay } from './helpers/safe-response';

const getOnThisDayEvent = new Promise((resolve, reject) => {
    const options = {
        uri: feed.ON_THIS_DAY,
        json: true,
        headers
    }

    request(options).then((object) => {
        const selected = object.selected
        const event = selected[Math.floor(Math.random() * selected.length)]

        resolve(event)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const onThisDayArticle = (event) => {
    const pages = event.pages
    const random = Math.floor(Math.random() * pages.length)
    const article = pages[random]

    return article
}

const handler = (payload, response) => {
    respondImmediately(response)
    getOnThisDayEvent.then((event) => {
        const years_ago = `🗓 ${today.year - event.year} years ago: ${event.text}`
        const pretext = years_ago
        const color = '#3366cc'

        const article = onThisDayArticle(event)
        const articleID = article.pageid

        const responseURL = payload.response_url
        const command = payload.text

        const key = articleKey(command, articleID)
        const messageAttachments = attachments(article, pretext, color, key)
        const responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)

        save(key, messageAttachments.withoutActions)
        respondWithDelay(responseURL, responseMessage)
    })
}

export default {
    pattern: /on\sthis\sday/ig,
    handler
}