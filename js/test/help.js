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

describe('/help', () => {
    it('should respond with status 200', done => {
        chai.request(app)
            .post(path)
            .send({ text: 'help',
                token: 'sampletoken' })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)

                done()
            })
    })

    describe('first attachment', () => {
        it('should have matching title', done => {
            chai.request(app)
                .post(path)
                .send({ text: 'help',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [attachment] = text.attachments
                    
                    expect(attachment.title).to.equal('Wikipedia will help you search the sum of all human knowledge')

                    done()
                })
        })

        it('should have matching text', done => {
            chai.request(app)
                .post(path)
                .send({ text: 'help',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [attachment] = text.attachments
                    
                    expect(attachment.text).to.equal('`/wikipedia search {your_search_term}` returns a Wikipedia article about {your_search_term} ' +
                    '\n`/wikipedia random` returns a random Wikipedia article ' +
                    '\n`/wikipedia on this day` returns a Wikipedia article about an event that occurred on this day in history' +
                    '\n`/wikipedia featured` returns a featured Wikipedia article' +
                    '\n`/wikipedia top read` returns today\'s top read Wikipedia article')

                    done()
                })
        })
    })

    describe('second attachment', () => {
        it('should have matching title', done => {
            chai.request(app)
                .post(path)
                .send({ text: 'help',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [, attachment] = text.attachments
                    
                    expect(attachment.title).to.equal('Configuring Wikipedia')

                    done()
                })
        })

        it('should have matching text', done => {
            chai.request(app)
                .post(path)
                .send({ text: 'help',
                    token: 'sampletoken' })
                .end((_, res) => {
                    let text = JSON.parse(res.text)
                    let [, attachment] = text.attachments
                    
                    expect(attachment.text).to.equal('`/wikipedia help` ... you\'re looking at it! 👀 \n')
                    
                    done()
                })
        })
    })
})