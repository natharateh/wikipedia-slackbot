'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { articleKey, attachments, message, ResponseType } from './helpers/message-defaults'
import headers from './helpers/request-headers'
import { save } from './helpers/cache'

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

        const command = payload.text

        const key = articleKey(command, articleID)
        const messageAttachments = attachments(article, pretext, color, key)
        const responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)
        
        response.status(200).json(responseMessage)
        save(key, messageAttachments.withoutActions)
    })
}

export default {
    pattern: /featured/ig,
    handler
}