'use strict'

/* eslint-disable camelcase */

import { redisClient, redisPrefix } from '../../index'

// 24 hours
const expiryTimeInSeconds = 86400

export function saveOriginalMessage(callbackID, originalMessage) {
    let key = redisKey(callbackID)

    redisClient.set(key, JSON.stringify(originalMessage), 'EX', expiryTimeInSeconds)
}

export const redisKey = (callbackID) => `${redisPrefix}-${callbackID}`

export const expiryTimeInHours = expiryTimeInSeconds / 3600