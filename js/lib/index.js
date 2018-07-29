'use strict'

import express from 'express'
import { json, urlencoded } from 'body-parser'
import mysql from 'mysql'
import config from 'config'

let app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

let port = process.env.PORT

app.listen(port, (err) => {
    if (err) {
        throw err
    } else {
        console.info(`\n🤩  Wikipedia bot LIVES on PORT ${port} 🤩`)
    }
})

let pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

app.post('/', (req, res) => {
    let payload = req.body

    if (!payload || payload.token !== 'config') {
        let err = `✋ Wiki—what? An invalid slash token was provided.
        Is your Slack slash token correctly configured?`

        console.log(err)
        res.status(401).end(err)
    }
})