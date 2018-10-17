'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import { saveMessageAttachments } from './helpers/saving-message-attachments'

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
    getTopReadArticle(feed.FEATURED_TODAY).then((article) => {
        saveMessageAttachmentsAndRespond(response, payload, article)
    }).
        catch((err) => {
            console.log(err)

            getTopReadArticle(feed.FEATURED_YESTERDAY).then((article) => {
                saveMessageAttachmentsAndRespond(response, payload, article)
            })
        })
}

function saveMessageAttachmentsAndRespond(response, payload, article) {
    const pretext = 'Top read today 📈'
    const color = '#3366cc'

    const articleID = article.pageid

    const commandCallbackID = payload.text

    const key = articleCallbackID(commandCallbackID, articleID)
    const messageAttachments = attachments(article, pretext, color, key)
    const responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)

    saveMessageAttachments(key, messageAttachments.withoutActions)
    response.status(200).json(responseMessage)
}

export default {
    pattern: /top\sread/ig,
    handler
}