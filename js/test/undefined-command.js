'use strict'

/* eslint-disable dot-location */
/* eslint-disable no-unused-expressions*/
/* eslint-disable no-undef*/
/* eslint-disable camelcase */

import chai from 'chai'
import 'chai/register-expect'
import chaiHttp from 'chai-http'
import { app, path } from '../lib/index'

chai.use(chaiHttp)

describe('/undefined command', () => {
    it('should respond with status 200', done => {
        chai.request(app)
            .post(path)
            .send({ text: 'tell me a joke',
                token: 'sampletoken' })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)

                done()
            })
    })

    it('should respond with help command', done => {
        chai.request(app)
            .post(path)
            .send({ text: 'tell me a joke',
                token: 'sampletoken' })
            .end((_, res) => {
                let text = JSON.parse(res.text)
                let [attachment] = text.attachments

                expect(attachment.title).to.equal('Wikipedia will help you search the sum of all human knowledge')
                
                done()
            })
    })
})