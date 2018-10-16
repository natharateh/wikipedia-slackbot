'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { saveMessageAttachments } from './helpers/saving-message-attachments'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import headers from './helpers/request-headers'
import respondSafely from './helpers/safe-response'

const getFeaturedArticle = new Promise((resolve, reject) => {
    let options = {
        uri: feed.FEATURED_TODAY,
        json: true,
        headers
    }

    request(options).then((object) => {
        let article = object.tfa

        resolve(article)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const handler = (payload, response) => {
    // Respond with 200 right away to avoid timeout
    response.status(200).end()

    getFeaturedArticle.then((article) => {
        let pretext = 'Featured article for today 💫'
        let color = '#FFCC33'

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
    pattern: /featured/ig,
    handler
}