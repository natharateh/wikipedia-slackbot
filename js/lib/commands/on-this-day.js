'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { today } from './helpers/date'
import headers from './helpers/request-headers'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import { saveMessageAttachments } from './helpers/saving-message-attachments'
import respondSafely from './helpers/safe-response'

const getOnThisDayEvent = new Promise((resolve, reject) => {
    let options = {
        uri: feed.ON_THIS_DAY,
        json: true,
        headers
    }

    request(options).then((object) => {
        let selected = object.selected
        let event = selected[Math.floor(Math.random() * selected.length)]

        resolve(event)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const onThisDayArticle = (event) => {
    let pages = event.pages
    let random = Math.floor(Math.random() * pages.length)
    let article = pages[random]

    return article
}

const handler = (payload, response) => {
    // Respond with 200 right away to avoid timeout
    response.status(200).end()

    getOnThisDayEvent.then((event) => {
        let years_ago = `🗓 ${today.year - event.year} years ago: ${event.text}`
        let pretext = years_ago
        let color = '#3366cc'

        let article = onThisDayArticle(event)
        let articleID = article.pageid
        
        let responseURL = payload.response_url
        let commandCallbackID = payload.text

        let key = articleCallbackID(commandCallbackID, articleID)
        let messageAttachments = attachments(article, pretext, color, key)
        let responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)

        saveMessageAttachments(key, messageAttachments.withoutActions)
        respondSafely(responseURL, responseMessage)
    })
}

export default {
    pattern: /on\sthis\sday/ig,
    handler
}