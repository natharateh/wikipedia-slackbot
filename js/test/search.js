'use strict'

/* eslint-disable dot-location */
/* eslint-disable no-unused-expressions*/
/* eslint-disable no-undef*/
/* eslint-disable camelcase */

import chai from 'chai'
import 'chai/register-expect'
import chaiHttp from 'chai-http'
import { app, path } from '../lib/index'
import { testHelper } from '../lib/commands/search'

import { testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties,
    testMessageAttachmentsWithActionsShouldHaveMatchingProperties,
    testCancelAction, testSendAction } from './common'

chai.use(chaiHttp)

describe('/search', () => {
    const pretext = testHelper.pretext
    const color = testHelper.pretext
    const match = 'katherine johnson'
    const command = `search ${match}`
    const articleID = '123'
    const articleKey = testHelper.articleKey(command, articleID)

    describe('katherine johnson', () => {
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

        it('should get title for match', done => {
            testHelper.getTitle(match).then((title) => {
                expect(title).to.not.be.null

                done()
            })
        })

        it('should get article for title', done => {
            testHelper.getTitle(match).then((title) => {
                testHelper.getArticle(title).then((article) => {
                    expect(article).to.not.be.null

                    done()
                })
            })
        })

        it('should get article with id', done => {
            testHelper.getTitle(match).then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const articleID = article.pageid

                    expect(articleID).to.not.be.null

                    done()
                })
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

        it('should have matching page not found attachments', done => {
            const attachments = testHelper.pageNotFoundAttachments(match)

            const expected = [
                {
                    pretext: `There's no Wikipedia page for ${match} 🧐`,
                    title: 'Learn how to create Wikipedia pages',
                    title_link: 'https://en.wikipedia.org/wiki/Wikipedia:How_to_create_a_page',
                    color: '#33cc99'
                },
                {
                    title: `Create a page for ${match}`,
                    title_link: `${testHelper.WIKIPEDIA_BASE_URL}wiki/${match}`,
                    color: '#3366cc'
                }
            ]

            expect(attachments).to.eql(expected)

            done()
        })

        it('should create message attachments with actions', done => {
            testHelper.getTitle(match).then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const attachments = testHelper.attachments(article, pretext, color, articleKey)
                    const withActions = attachments.withActions
        
                    expect(withActions).to.not.be.null
        
                    done()
                })
            })
        })
    
        it('should create message attachments with send action', done => {
            testHelper.getTitle(match).then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const attachments = testHelper.attachments(article, pretext, color, articleKey)
                    const withActions = attachments.withActions
                    const [first] = withActions
                
                    const [action] = first.actions
    
                    testSendAction(action)
    
                    done()
                })
            })
        })
    
        it('should create message attachments with cancel action', done => {
            testHelper.getTitle(match).then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const attachments = testHelper.attachments(article, pretext, color, articleKey)
                    const withActions = attachments.withActions
                    const [first] = withActions
                
                    const [, action] = first.actions
    
                    testCancelAction(action)

                    done()
                })
            })
        })
    
        it('should create message attachments with actions and matching properties', done => {
            testHelper.getTitle('katherine johnson').then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const attachments = testHelper.attachments(article, pretext, color, articleKey)
                    const withActions = attachments.withActions
                    const [first] = withActions
    
                    testMessageAttachmentsWithActionsShouldHaveMatchingProperties(first, pretext, color, articleKey)

                    done()
                })
            })
        })
    
        it('should create message attachments without actions', done => {
            testHelper.getTitle('katherine johnson').then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const attachments = testHelper.attachments(article, pretext, color, articleKey)
                    const withoutActions = attachments.withoutActions
    
                    expect(withoutActions).to.not.be.null

                    done()
                })
            })
        })
    
        it('should create message attachments without actions and matching properties', done => {
            testHelper.getTitle('katherine johnson').then((title) => {
                testHelper.getArticle(title).then((article) => {
                    const attachments = testHelper.attachments(article, pretext, color, articleKey)
                    const withoutActions = attachments.withoutActions
                
                    testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties(withoutActions, pretext, color)
                    
                    done()
                })
            })
        })
    })
})