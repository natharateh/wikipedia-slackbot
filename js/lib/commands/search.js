'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { searchURL, pageSummaryURL, WIKIPEDIA_BASE_URL } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { articleCallbackID, attachments, message, ResponseType } from './helpers/message-defaults'
import { saveMessageAttachments } from './helpers/saving-message-attachments'
import respondSafely from './helpers/safe-response'

const getTitle = (match) => new Promise((resolve, reject) => {
    let options = {
        uri: searchURL(match),
        json: true,
        headers
    }

    request(options).then((object) => {
        let [page] = object.query.prefixsearch
        let title = page.title

        resolve(title)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const getArticle = (title) => new Promise((resolve, reject) => {
    let options = {
        uri: pageSummaryURL(title),
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

    const regex = /search\s(.*)/
    const [, match] = regex.exec(payload.text)
    const responseURL = payload.response_url

    getTitle.then((title) => {
        getArticle(title).then((article) => {
            let pretext = '🔍'
            let color = '#3366cc'

            let articleID = article.pageid

            let commandCallbackID = payload.text
    
            let key = articleCallbackID(commandCallbackID, articleID)
            let messageAttachments = attachments(article, pretext, color, key)
            let responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)
    
            saveMessageAttachments(key, messageAttachments.withoutActions)      
            respondSafely(responseURL, responseMessage)
        }).

            catch((err) => {
                console.log(err)
                respondWithPageNotFound(responseURL, match)
            })

    }).
        catch((err) => {
            console.log(err)
            respondWithPageNotFound(responseURL, match)
        })
  
}

const respondWithPageNotFound = (responseURL, match) => {

    let attachments = [
        {
            pretext: `There's no Wikipedia page for ${match} 🧐`,
            title: 'Learn how to create Wikipedia pages',
            title_link: 'https://en.wikipedia.org/wiki/Wikipedia:How_to_create_a_page',
            color: '#33cc99'
        },
        {
            title: `Create a page for ${match}`,
            title_link: `${WIKIPEDIA_BASE_URL}wiki/${match}`,
            color: '#3366cc'
        }
    ]

    let responseMessage = message(ResponseType.EPHEMERAL, attachments)

    respondSafely(responseURL, responseMessage)
}

export default {
    pattern: /search\s/ig,
    handler
}