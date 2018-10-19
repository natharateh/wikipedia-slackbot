'use strict'

/* eslint-disable dot-location */
/* eslint-disable no-unused-expressions*/
/* eslint-disable no-undef*/
/* eslint-disable camelcase */

import chai from 'chai'
import 'chai/register-expect'
import chaiHttp from 'chai-http'
import { app, path } from '../lib/index'
import { testHelper } from '../lib/commands/top-read'

import { testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties,
    testMessageAttachmentsWithActionsShouldHaveMatchingProperties,
    testCancelAction, testSendAction } from './common'

chai.use(chaiHttp)

describe('/top read', () => {
    const pretext = testHelper.pretext
    const color = testHelper.color
    const command = 'top read'
    const articleID = '123'
    const articleKey = testHelper.articleKey(command, articleID)

    it('should respond with status 200', done => {
        chai.request(app)
            .post(path)
            .send({ text: 'featured',
                token: 'sampletoken' })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                
                done()
            })
    })

    it('should get today\'s top read article', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            expect(article).to.not.be.null

            done()
        })
    })

    it('should get yesterday\'s top read article', done => {
        const yesterday = testHelper.feed.FEATURED_YESTERDAY
        
        testHelper.getTopReadArticle(yesterday).then((article) => {
            expect(article).to.not.be.null

            done()
        })
    })

    it('should get article with id', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const articleID = article.pageid

            expect(articleID).to.not.be.null

            done()
        })
    })

    it('should get pretext', done => {
        expect(pretext).to.not.be.null

        done()
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
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions

            expect(withActions).to.not.be.null

            done()
        })
    })

    it('should create message attachments with send action', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions
            const [first] = withActions
            
            const [action] = first.actions

            testSendAction(action)

            done()
        })
    })

    it('should create message attachments with cancel action', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions
            const [first] = withActions
            
            const [, action] = first.actions

            testCancelAction(action)

            done()
        })
    })

    it('should create message attachments with actions and matching properties', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withActions = attachments.withActions
            const [first] = withActions

            testMessageAttachmentsWithActionsShouldHaveMatchingProperties(first, pretext, color, articleKey)

            done()
        })
    })

    it('should create message attachments without actions', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withoutActions = attachments.withoutActions

            expect(withoutActions).to.not.be.null

            done()
        })
    })

    it('should create message attachments without actions and matching properties', done => {
        const today = testHelper.feed.FEATURED_TODAY

        testHelper.getTopReadArticle(today).then((article) => {
            const attachments = testHelper.attachments(article, pretext, color, articleKey)
            const withoutActions = attachments.withoutActions

            testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties(withoutActions, pretext, color)

            done()
        })
    })

})