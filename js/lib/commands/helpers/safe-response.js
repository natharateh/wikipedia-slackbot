'use strict'

import request from 'request-promise-native'

export function respondImmediatelyToAvoidTimeOut(response) {
    // Respond with 200 right away to avoid timeout
    response.status(200).end()
}

export function respondSafely(responseURL, message) {
    let options = {
        method: 'POST',
        uri: responseURL,
        json: true,
        headers: {
            'content-type': 'application/json'
        },
        body: message
    }

    request(options).catch((err) => {
        console.log(err.error)
    })
}