'use strict';

const libfaketimeEnv = require('.');
const test = require('tape');

test('libfaketimeEnv() on Windows', async t => {
	try {
		await libfaketimeEnv();
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'As with libfaketime, libfaketime-env doesn\'t support Windows.',
			'should fail.'
		);
	}

	t.end();
});
