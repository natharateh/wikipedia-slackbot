'use strict'

/* eslint-disable camelcase */

export default (payload, attachments) => ({
    response_type: 'ephemeral',
    channel: payload.channel_name,
    attachments
})