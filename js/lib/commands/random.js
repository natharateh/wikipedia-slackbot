'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { RANDOM_URL } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import { saveMessageAttachments } from './helpers/saving-message-attachments'

const getRandomArticle = new Promise((resolve, reject) => {
    const options = {
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
    getRandomArticle.then((article) => {
        const pretext = '🎲'
        const color = '#3366cc'

        const articleID = article.pageid

        const commandCallbackID = payload.text

        const key = articleCallbackID(commandCallbackID, articleID)
        const messageAttachments = attachments(article, pretext, color, key)
        const responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)
        
        saveMessageAttachments(key, messageAttachments.withoutActions)
        response.status(200).json(responseMessage)
    })

}

export default {
    pattern: /random/ig,
    handler
}