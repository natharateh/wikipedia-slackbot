'use strict'

/* eslint-disable dot-location */
/* eslint-disable no-unused-expressions*/
/* eslint-disable no-undef*/
/* eslint-disable camelcase */

import chai from 'chai'
import 'chai/register-expect'
import chaiHttp from 'chai-http'
import { app, path } from '../lib/index'
import { testHelper } from '../lib/commands/on-this-day'

import { testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties,
    testMessageAttachmentsWithActionsShouldHaveMatchingProperties,
    testCancelAction, testSendAction } from './common'

chai.use(chaiHttp)

describe('/on this day', () => {
    const articleID = '123'
    const color = testHelper.color
    const command = 'on this day'
    const articleKey = testHelper.articleKey(command, articleID)

    it('should respond with status 200', done => {
        chai.request(app)
            .post(path)
            .send({ text: command,
                token: 'sampletoken' })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)

                done()
            })
    })

    it('should get event', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            expect(event).to.not.be.null

            done()
        })
    })

    it('should get event with year', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            expect(event.year).to.not.be.null

            done()
        })
    })

    it('should get event with text', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            expect(event.text).to.not.be.null

            done()
        })
    })

    it('should get article', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            
            expect(article).to.not.be.null

            done()
        })
    })

    it('should get article with id', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const articleID = article.pageid

            expect(articleID).to.not.be.null

            done()
        })
    })

    it('should get pretext', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const pretext = testHelper.pretext(testHelper.today, event)

            expect(pretext).to.not.be.null
            done()
        })
    })

    it('should get color', done => {
        expect(color).to.not.be.null
        done()
    })

    it('should get matching article key', done => {
        expect(articleKey).to.eql(`${command}-${articleID}`)
        done()
    })

    it('should create message attachments with actions', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const pretext = testHelper.pretext(testHelper.today, event)
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions

            expect(withActions).to.not.be.null

            done()
        })
    })

    it('should create message attachments with send action', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const pretext = testHelper.pretext(testHelper.today, event)
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions
            const [first] = withActions
            
            const [action] = first.actions

            testSendAction(action)

            done()
        })
    })

    it('should create message attachments with cancel action', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const pretext = testHelper.pretext(testHelper.today, event)
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions
            const [first] = withActions
            
            const [, action] = first.actions

            testCancelAction(action)

            done()
        })
    })

    it('should create message attachments with actions and matching properties', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const pretext = testHelper.pretext(testHelper.today, event)
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions
            const [first] = withActions

            testMessageAttachmentsWithActionsShouldHaveMatchingProperties(first, pretext, color, articleKey)

            done()
        })
    })

    it('should create message attachments without actions', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const pretext = testHelper.pretext(testHelper.today, event)
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withoutActions = attachments.withoutActions

            expect(withoutActions).to.not.be.null

            done()
        })
    })

    it('should create message attachments without actions and matching properties', done => {
        testHelper.getOnThisDayEvent.then((event) => {
            const article = testHelper.onThisDayArticle(event)
            const pretext = testHelper.pretext(testHelper.today, event)
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withoutActions = attachments.withoutActions
            
            testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties(withoutActions, pretext, color)

            done()
        })
    })
})