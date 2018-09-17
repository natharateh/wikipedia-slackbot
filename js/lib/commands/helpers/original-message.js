'use strict'

/* eslint-disable camelcase */

import { redisClient, redisPrefix } from '../..'

export function saveOriginalMessage(payload, callbackID, originalMessage) {
    let teamID = payload.team_id
    let channelID = payload.channel_id
    let userID = payload.user_id
    let token = payload.token

    let key = redisKey(teamID, channelID, userID, token, callbackID)

    redisClient.set(key, JSON.stringify(originalMessage))
}

export const redisKey = (teamID, channelID, userID, token, callbackID) => `${redisPrefix}-${teamID}-${channelID}-${userID}-${token}-${callbackID}`