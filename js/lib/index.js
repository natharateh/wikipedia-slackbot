'use strict'

import express from 'express'
import { json, urlencoded } from 'body-parser'
import mysql from 'mysql'
import config from '../config'

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

app.get(`/${config.toolname}`, (req, res) => { res.send('🤓') })

let pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

app.post('/', (req, res) => {
    let payload = req.body

    let teamID = payload.team_id

    pool.query(`select * from config.table where team_id = ${teamID}`, (err, results, fields) => {
        if (err) {
            throw err
        } else {
            console.log(results)
            console.log(fields)
        }
    })

    if (!payload || payload.token !== 'config') {
        let err = `✋ Wiki—what? An invalid slash token was provided.
        Is your Slack slash token correctly configured?`

        console.log(err)
        res.status(401).end(err)
    }
})