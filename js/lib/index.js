'use strict'

import express from 'express'
import { json, urlencoded } from 'body-parser'
import config from '../config'
import * as commands from './commands'
import helpCommand from './commands/help'

let app = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.set('trust proxy', true)

let port = process.env.PORT

app.listen(port, (err) => {
    if (err) {
        throw err
    } else {
        console.info(`\n🤩  Wikipedia bot LIVES on PORT ${port} 🤩`)
    }
})

let path = `/${config.toolname}`

app.get(path, (req, res) => { res.send('🤓') })

app.post(path, (req, res) => {
    let payload = req.body

    if (!payload || !payload.token) {
        let err = `✋ Wiki—what? An invalid slash token was provided.
        Is your Slack slash token correctly configured?`

        console.log(err)
        res.status(401).end(err)
    }

    const reducer = (acc, cmd) => (payload.text.match(cmd.pattern) ? cmd : acc) // eslint-disable-line no-extra-parens
    
    const command = commands.reduce(reducer, helpCommand)

    command.handler(payload, res)
})