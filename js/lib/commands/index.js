'use strict'

import fs from 'fs'

let commands = []

fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        commands.push(require(`./${file}`).default) // eslint-disable-line global-require
    }
})

export default commands