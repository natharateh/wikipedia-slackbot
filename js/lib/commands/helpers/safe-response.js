'use strict'

import request from 'request-promise-native'

export function respondImmediately(response) {
    response.status(200).end()
}

export function respondWithDelay(uri, body) {
    const options = {
        uri,
        json: true,
        body,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    request(options).catch((err) => {
        console.log(err)
    })
}