'use strict'

import request from 'request-promise-native'

export default function(responseURL, message) {
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