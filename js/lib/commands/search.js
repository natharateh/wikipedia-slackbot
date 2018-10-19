'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { searchURL, pageSummaryURL, WIKIPEDIA_BASE_URL } from './helpers/endpoints'
import headers from './helpers/request-headers'
import { articleKey, attachments, message, ResponseType } from './helpers/message-defaults'
import { save } from './helpers/cache'
import { respondImmediately, respondWithDelay } from './helpers/safe-response'

const getTitle = (match) => new Promise((resolve, reject) => {
    const options = {
        uri: searchURL(match),
        json: true,
        headers
    }

    request(options).then((object) => {
        const [page] = object.query.prefixsearch
        const title = page.title
        
        resolve(title)
    }).
    
        catch((err) => {
            reject(err)
        })
})

const getArticle = (title) => new Promise((resolve, reject) => {
    const options = {
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

const pretext = '🔍'
const color = '#3366cc'

const handler = (payload, response) => {
    respondImmediately(response)

    const responseURL = payload.response_url

    const regex = /search\s(.*)/
    const [, match] = regex.exec(payload.text)

    getTitle(match).then((title) => {
        getArticle(title).then((article) => {
            const articleID = article.pageid

            const command = payload.text

            const key = articleKey(command, articleID)
            const messageAttachments = attachments(article, pretext, color, key)
            const responseMessage = message(ResponseType.EPHEMERAL, messageAttachments.withActions)
    
            save(key, messageAttachments.withoutActions)      
            respondWithDelay(responseURL, responseMessage)
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

const pageNotFoundAttachments = (match) => {
    const attachments = [
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

    return attachments
}

const respondWithPageNotFound = (responseURL, match) => {
    const attachments = pageNotFoundAttachments(match)
    const responseMessage = message(ResponseType.EPHEMERAL, attachments)

    respondWithDelay(responseURL, responseMessage)
}

export const testHelper = {
    getTitle,
    getArticle,
    articleKey,
    attachments,
    pageNotFoundAttachments,
    WIKIPEDIA_BASE_URL,
    pretext,
    color
}

export const search = {
    pattern: /search\s/ig,
    handler
}