'use strict'

/* eslint-disable camelcase */

import request from 'request-promise-native'
import { feed } from './helpers/endpoints'
import { today } from './helpers/date'
import message from '../message-defaults'
import headers from './helpers/request-headers'

const handler = (payload, response) => {

    let options = {
        uri: feed.ON_THIS_DAY,
        json: true,
        headers
    }

    request(options).then((object) => {

        let selected = object.selected
        let event = selected[Math.floor(Math.random() * selected.length)]
        let pages = event.pages
        let random = Math.floor(Math.random() * pages.length)
        let page = pages[random]
        let title = page.titles.normalized
        let title_link = page.content_urls.desktop.page
        let text = page.extract
        let years_ago = `🗓 ${today.year - event.year} years ago: ${event.text}`

        let attachments = [
            {
                pretext: years_ago,
                title,
                title_link,
                text,
                color: '#3366cc'
            }
        ]

        response.set('content-type', 'application/json')
        response.status(200).json(message(payload, attachments))
    })

}

export default {
    pattern: /on\sthis\sday/ig,
    handler
}