'use strict';

const libfaketimeEnv = require('.');
const test = require('tape');

test('libfaketimeEnv() with an environment where libfaketime is not installed', async t => {
	const env = await libfaketimeEnv();

	for (const propertyName of ['LD_PRELOAD', 'DYLD_INSERT_LIBRARIES']) {
		t.equal(
			Reflect.getOwnPropertyDescriptor(env, propertyName),
			undefined,
			`should return an object without \`${propertyName}\` property.`
		);
	}

	t.end();
});
