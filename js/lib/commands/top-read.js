'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { saveMessageAttachments } from './helpers/saving-message-attachments'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import respondSafely from './helpers/safe-response'

const getTopReadArticle = (uri) => new Promise((resolve, reject) => {
    let options = {
        uri,
        json: true,
        headers
    }

    request(options).then((object) => {
        let articles = object.mostread.articles
        let [article] = articles

        resolve(article)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const handler = (payload, response) => {
    // Respond with 200 right away to avoid timeout
    response.status(200).end()

    getTopReadArticle(feed.FEATURED_TODAY).then((article) => {
        saveMessageAttachmentsAndRespond(payload, article)
    }).
        catch((err) => {
            console.log(err)

            getTopReadArticle(feed.FEATURED_YESTERDAY).then((article) => {
                saveMessageAttachmentsAndRespond(payload, article)
            })
        })
}

function saveMessageAttachmentsAndRespond(payload, article) {
    let pretext = 'Top read today 📈'
    let color = '#3366cc'

    let articleID = article.pageid

    let responseURL = payload.response_url
    let commandCallbackID = payload.text

    let key = articleCallbackID(commandCallbackID, articleID)
    let messageAttachments = attachments(article, pretext, color, key)
    let responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)

    saveMessageAttachments(key, messageAttachments.withoutActions)
    respondSafely(responseURL, responseMessage)
}

export default {
    pattern: /top\sread/ig,
    handler
}