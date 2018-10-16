'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { RANDOM_URL } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import { saveMessageAttachments } from './helpers/saving-message-attachments'
import respondSafely from './helpers/safe-response'

const getRandomArticle = new Promise((resolve, reject) => {
    let options = {
        uri: RANDOM_URL,
        json: true,
        headers
    }

    request(options).then((object) => {
        resolve(object)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const handler = (payload, response) => {
    // Respond with 200 right away to avoid timeout
    response.status(200).end()

    getRandomArticle.then((article) => {
        let pretext = '🎲'
        let color = '#3366cc'

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
    pattern: /random/ig,
    handler
}