'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import headers from './helpers/request-headers'
import { saveMessageAttachments } from './helpers/saving-message-attachments'

const getFeaturedArticle = new Promise((resolve, reject) => {
    const options = {
        uri: feed.FEATURED_TODAY,
        json: true,
        headers
    }

    request(options).then((object) => {
        const article = object.tfa

        resolve(article)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const handler = (payload, response) => {
    getFeaturedArticle.then((article) => {
        const pretext = 'Featured article for today 💫'
        const color = '#FFCC33'

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
    pattern: /featured/ig,
    handler
}