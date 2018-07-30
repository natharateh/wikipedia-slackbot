'use strict'

/* eslint-disable camelcase */

let attachments = [
    {
        title: 'Wikipedia will help you search the sum of all human knowledge',
        color: '#3366cc',
        text: '`/wikipedia search {your_search_term}` returns a Wikipedia article about {your_search_term} \n`/wikipedia random` returns a random Wikipedia article \n`/wikipedia on this day` returns a Wikipedia article about an event that occurred on this day in history\n`/wikipedia featured` returns a featured Wikipedia article\n`/wikipedia top read` returns today\'s top read Wikipedia article',
        mrkdwn_in: ['text']
    },
    {
        title: 'Configuring Wikipedia',
        color: '#a2a9b1',
        text: '`/wikipedia help` ... you\'re looking at it! 👀 \n',
        mrkdwn_in: ['text']
    }
]

const handler = (payload, res) => {
    let msg = {
        response_type: 'in_channel',
        channel: payload.channel_name,
        attachments
    }

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
}

export default {
    pattern: /help/ig,
    handler
}