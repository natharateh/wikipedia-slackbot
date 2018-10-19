'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { articleKey, attachments, message, ResponseType } from './helpers/message-defaults'
import headers from './helpers/request-headers'
import { save } from './helpers/cache'
import { respondImmediately, respondWithDelay } from './helpers/safe-response'

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

const pretext = 'Featured article for today 💫'
const color = '#FFCC33'

const handler = (payload, response) => {
    respondImmediately(response)

    getFeaturedArticle.then((article) => {
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

export const testHelper = {
    getFeaturedArticle,
    articleKey,
    attachments,
    pretext,
    color
}

export const featured = {
    pattern: /featured/ig,
    handler
}