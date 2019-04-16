'use strict';

if (process.platform === 'win32') {
	module.exports = async function libfaketimeEnv() {
		const error = new Error('As with libfaketime, libfaketime-env doesn\'t support Windows.');

		error.code = 'ERR_UNSUPPORTED_PLATFORM';
		throw error;
	};
} else {
	const {basename} = require('path');
	const originalExecFile = require('child_process').execFile;
	const {promisify} = require('util');

	const [BASENAME, KEY, osSpecificEnv] = process.platform === 'darwin' ? [
		'libfaketime.1.dylib',
		'DYLD_INSERT_LIBRARIES',
		{DYLD_FORCE_FLAT_NAMESPACE: '1'}
	] : [
		'libfaketime.so.1',
		'LD_PRELOAD',
		{}
	];
	const execFile = promisify(originalExecFile);
	const isLibPath = path => basename(path) === BASENAME;

	module.exports = async function libfaketimeEnv(...args) {
		const argLen = args.length;

		if (argLen !== 0) {
			const error = new RangeError(`Expected no arguments, but got ${argLen} argument${argLen === 1 ? '' : 's'}.`);

			error.code = 'ERR_TOO_MANY_ARGS';
			throw error;
		}

		let libPath;

		try {
			libPath = require.resolve(`/usr/local/lib/faketime/${BASENAME}`);
		} catch {}

		try {
			libPath = (await execFile('dpkg-query', ['--listfiles', 'libfaketime'], {timeout: 8000})).stdout.split('\n').find(isLibPath);
		} catch {}

		return {
			...libPath ? {[KEY]: libPath} : {},
			...osSpecificEnv,
			...args[0]
		};
	};
}
