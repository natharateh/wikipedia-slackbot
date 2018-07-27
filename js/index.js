'use strict'

import express from 'express'
import { json, urlencoded } from 'body-parser'

let app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

let port = process.env.PORT

app.listen(port, (err) => {
    if (err) {
        throw err
    } else {
        console.log(`\n🤩  Wikipedia bot LIVES on PORT ${port} 🤩`) 
    }
})