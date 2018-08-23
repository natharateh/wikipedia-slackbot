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

describe('/search', () => {
    describe('katherine johnson', () => {
        it('should respond with status 200', done => {
            chai.request(app)
                .post('/w-slackbot')
                .send({ text: 'search katherine johnson',
                    token: 'sampletoken' })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    done()
                })
        })

        it('should have matching pretext', done => {
            chai.request(app)
                .post('/w-slackbot')
                .send({ text: 'search katherine johnson',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [attachment] = text.attachments
    
                    expect(attachment.pretext).to.equal('🔍')
                    done()
                })
        })

        it('should have title', done => {
            chai.request(app)
                .post('/w-slackbot')
                .send({ text: 'search katherine johnson',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [attachment] = text.attachments
    
                    expect(attachment.title).to.not.be.empty
                    done()
                })
        })

        it('should have title link', done => {
            chai.request(app)
                .post('/w-slackbot')
                .send({ text: 'search katherine johnson',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [attachment] = text.attachments
    
                    expect(attachment.title_link).to.not.be.empty
                    done()
                })
        })

        it('should have text', done => {
            chai.request(app)
                .post('/w-slackbot')
                .send({ text: 'search katherine johnson',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [attachment] = text.attachments
    
                    expect(attachment.text).to.not.be.empty
                    done()
                })
        })
    })

})