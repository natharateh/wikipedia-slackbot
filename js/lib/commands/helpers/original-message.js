'use strict'

/* eslint-disable camelcase */

import { redisClient, redisPrefix } from '../..'

// 24 hours
const expiryTimeInSeconds = 86400

export function saveOriginalMessage(payload, callbackID, originalMessage) {
    let teamID = payload.team_id
    let channelID = payload.channel_id
    let userID = payload.user_id
    let token = payload.token

    let key = redisKey(teamID, channelID, userID, token, callbackID)

    redisClient.set(key, JSON.stringify(originalMessage), 'EX', expiryTimeInSeconds)
}

export const redisKey = (teamID, channelID, userID, token, callbackID) => `${redisPrefix}-${teamID}-${channelID}-${userID}-${token}-${callbackID}`

export const expiryTimeInHours = expiryTimeInSeconds / 3600