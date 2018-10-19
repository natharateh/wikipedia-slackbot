'use strict'

/* eslint-disable no-unused-expressions*/
/* eslint-disable no-undef*/

import 'chai/register-expect'

export function testMessageAttachmentsWithoutActionsShouldHaveMatchingProperties(attachments, pretext, color) {
    expect(attachments.pretext).to.equal(pretext)
    expect(attachments.title).to.not.be.null
    expect(attachments.title_link).to.not.be.null
    expect(attachments.text).to.not.be.null
    expect(attachments.color).to.equal(color)
}

export function testMessageAttachmentsWithActionsShouldHaveMatchingProperties(attachments, pretext, color, articleKey) {
    expect(attachments.pretext).to.equal(pretext)
    expect(attachments.title).to.not.be.null
    expect(attachments.title_link).to.not.be.null
    expect(attachments.text).to.not.be.null
    expect(attachments.color).to.equal(color)
    expect(attachments.callback_id).to.equal(articleKey)
}

export function testCancelAction(action) {
    const expected = {
        name: 'cancel',
        text: 'Cancel',
        type: 'button',
        style: 'danger',
        value: 'cancel'
    }

    expect(action).to.eql(expected)
}

export function testSendAction(action) {
    const expected = {
        name: 'send',
        text: 'Send',
        type: 'button',
        value: 'send'
    }

    expect(action).to.eql(expected)
}