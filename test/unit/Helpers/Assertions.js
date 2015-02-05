var expect = require('chai').expect;

module.exports = {
    assertNoThrow: assertNoThrow,
    assertThrows: assertThrows
};

/**
 *
 * @param closure
 * @param context
 */
function assertNoThrow(closure, context) {
    'use strict';

    expect(closure.bind(context)).to.not.throw();
}

/**
 *
 * @param closure
 * @param message
 * @param context
 */
function assertThrows(closure, message, context) {
    'use strict';

    expect(closure.bind(context)).to.throw(message);
}