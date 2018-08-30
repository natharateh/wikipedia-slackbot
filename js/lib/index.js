'use strict'

/* eslint-disable camelcase */

import express from 'express'
import { json, urlencoded } from 'body-parser'
import commands from './commands'
import helpCommand from './commands/help'
import config from '../config'
import request from 'request-promise-native'

export let app = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.set('trust proxy', true)

let port = process.env.PORT || 4390

app.listen(port, (err) => {
    if (err) {
        throw err
    } else {
        console.info(`\n🤩  Wikipedia bot LIVES on PORT ${port} 🤩`)
    }
})

export let path = `/${config.toolname}`

// Authentication

let landingPagePath = 'https://nambatee.github.io/wikipedia-slackbot/'

app.get(`${path}/auth`, (req, res) => {
    const code = req.query.code

    if (!code) {
        res.redirect(landingPagePath)
        res.status(401).end()

        return
    }

    const client_id = config.client_id
    const client_secret = config.client_secret

    if (!client_id) {
        res.redirect(landingPagePath)
        res.status(400).end('Undefined client id')

        return
    }

    if (!client_secret) {
        res.redirect(landingPagePath)
        res.status(400).end('Undefined client secret')

        return
    }

    let data = {
        client_id,
        client_secret,
        code
    }

    let options = {
        method: 'POST',
        uri: 'https://slack.com/api/oauth.access',
        formData: data
    }

    request(options).then(() => {
        res.redirect(landingPagePath)
        res.status(200).end()
    }).

        catch((err) => {
            console.log(err)
            res.status(400).end(err)
        })

})

// Commands

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