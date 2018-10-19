'use strict'

import request from 'request-promise-native'

export function respondImmediately(response) {
    response.status(200).end()
}

export function respondWithDelay(uri, body) {
    if (typeof uri === 'undefined') {
        
        return
    }
    const options = {
        method: 'POST',
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