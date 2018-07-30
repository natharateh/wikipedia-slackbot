'use strict'

import fs from 'fs'

const reducer = (acc, file) => {
    if (file !== 'index.js') {
        acc.push(require(`./${file}`)) // eslint-disable-line global-require
    }

    return acc
}

const commands = fs.readdirSync(__dirname).reduce(reducer)

export default commands