'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { articleKey, attachments, message, ResponseType } from './helpers/message-defaults'
import { save } from './helpers/cache'
import { respondImmediately, respondWithDelay } from './helpers/safe-response'

const getTopReadArticle = (uri) => new Promise((resolve, reject) => {
    const options = {
        uri,
        json: true,
        headers
    }

    request(options).then((object) => {
        const articles = object.mostread.articles
        const [article] = articles

        resolve(article)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const handler = (payload, response) => {
    respondImmediately(response)

    getTopReadArticle(feed.FEATURED_TODAY).then((article) => {
        saveMessageAndRespond(payload, article)
    }).
        catch((err) => {
            console.log(err)

            getTopReadArticle(feed.FEATURED_YESTERDAY).then((article) => {
                saveMessageAndRespond(payload, article)
            })
        })
}

const pretext = 'Top read today 📈'
const color = '#3366cc'

function saveMessageAndRespond(payload, article) {
    const articleID = article.pageid

    const responseURL = payload.response_url
    const command = payload.text

    const key = articleKey(command, articleID)
    const messageAttachments = attachments(article, pretext, color, key)
    const responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)

    save(key, messageAttachments.withoutActions)
    respondWithDelay(responseURL, responseMessage)
}

export const testHelper = {
    getTopReadArticle,
    articleKey,
    attachments,
    feed,
    pretext,
    color
}

export const topRead = {
    pattern: /top\sread/ig,
    handler
}