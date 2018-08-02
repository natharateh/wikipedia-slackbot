'use strict'

/* eslint-disable camelcase */

export default (payload, attachments) => ({
    response_type: 'in_channel',
    channel: payload.channel_name,
    attachments
})