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
    it('should return Featured article', done => {
        chai.request(app)
            .post('/w-slackbot')
            .send({ text: 'featured',
                token: 'sampletoken' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)

                let text = textJSON(res.text)
                let attachment = firstAttachment(text)
                let response = attachmentObject(attachment)

                expect(response.pretext).to.equal('Featured article for today 💫')
                expect(response.title).to.not.be.empty
                expect(response.title_link).to.not.be.empty
                expect(response.title_text).to.not.be.empty
                done()
            })
    })
})

const textJSON = text => JSON.parse(text)

const firstAttachment = text => {
    let [attachment] = text.attachments

    return attachment
}

const attachmentObject = attachment => ({
    pretext: attachment.pretext,
    title: attachment.title,
    title_link: attachment.title_link,
    title_text: attachment.text
})