'use strict'

import actions from './actions'

/* eslint-disable camelcase */

export const ResponseType = Object.freeze({
    EPHEMERAL: 'ephemeral',
    IN_CHANNEL: 'in_channel'
})

export const message = (responseType, attachments) => ({
    response_type: responseType,
    attachments
})

export const articleKey = (command, articleID) => `${command}-${articleID}`

export const attachments = (article, pretext, color, callback_id) => {
    let title = article.titles.normalized
    let title_link = article.content_urls.desktop.page
    let text = article.extract

    let attachmentsWithActions = [
        {
            pretext,
            title,
            title_link,
            text,
            color,
            callback_id,
            actions
        }
    ]

    let attachmentsWithoutActions = {
        pretext,
        title,
        title_link,
        text,
        color
    }

    return {
        withActions: attachmentsWithActions, 
        withoutActions: attachmentsWithoutActions
    }
}