'use strict'

/* eslint-disable dot-location */
/* eslint-disable no-unused-expressions*/
/* eslint-disable no-undef*/
/* eslint-disable camelcase */

import chai from 'chai'
import 'chai/register-expect'
import chaiHttp from 'chai-http'
import app from '../lib/index'

chai.use(chaiHttp)

describe('/featured', () => {
    it('should respond with status 200', done => {
        chai.request(app)
            .post('/w-slackbot')
            .send({ text: 'featured',
                token: 'sampletoken' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                done()
            })
    })

    it('should return Featured article', done => {
        chai.request(app)
            .post('/w-slackbot')
            .send({ text: 'featured',
                token: 'sampletoken' })
            .end((_, res) => {
                let text = JSON.parse(res.text)
                let [attachment] = text.attachments
                let pretext = attachment.pretext
                let title = attachment.title
                let title_link = attachment.title_link
                let title_text = attachment.text

                expect(pretext).to.equal('Featured article for today 💫')
                expect(title).to.not.be.empty
                expect(title_link).to.not.be.empty
                expect(title_text).to.not.be.empty
                done()
            })
    })
})