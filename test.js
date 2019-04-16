'use strict';

const {execFile} = require('child_process');
const {promisify} = require('util');

const libfaketimeEnv = require('.');
const test = require('tape');

test('libfaketimeEnv()', async t => {
	t.equal(
		(await promisify(execFile)('node', ['-p', 'new Date().getFullYear()'], {
			env: {
				...process.env,
				...await libfaketimeEnv(),
				FAKETIME: '2018-01-02 03:04:05'
			}
		})).stdout,
		'2018\n',
		'should return environment variables that make libfaketime work.'
	);

	t.end();
});

test('Argument validation', async t => {
	try {
		await libfaketimeEnv('?');
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'Expected no arguments, but got 1 argument.',
			'should fail when it takes an argument.'
		);
	}

	try {
		await libfaketimeEnv('!', '?');
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'Expected no arguments, but got 2 arguments.',
			'should fail when it takes arguments.'
		);
	}

	t.end();
});
