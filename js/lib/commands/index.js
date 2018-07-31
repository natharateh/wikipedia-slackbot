'use strict'

import fs from 'fs'

fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        require(`./${file}`) // eslint-disable-line global-require
    }
})
