# libfaketime-env

[![npm version](https://img.shields.io/npm/v/libfaketime-env.svg)](https://www.npmjs.com/package/libfaketime-env)
[![Build Status](https://travis-ci.com/shinnn/libfaketime-env.svg?branch=master)](https://travis-ci.com/shinnn/libfaketime-env)
[![codecov](https://codecov.io/gh/shinnn/libfaketime-env/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/libfaketime-env)

Create environment variables that make [libfaketime](https://github.com/wolfcw/libfaketime) work

```javascript
const libfaketimeEnv = require('libfaketime-env');

(async () => {
  await libfaketimeEnv();
  //=> {LD_PRELOAD: '/usr/lib/x86_64-linux-gnu/faketime/libfaketime.so.1'}
})();
```

[libfaketime](https://github.com/wolfcw/libfaketime/blob/master/README) is useful for testing date-sensitive behavior of an application or a library:

> libfaketime intercepts various system calls that programs use to retrieve the current date and time. It then reports modified (faked) dates and times (as specified by you, the user) to these programs. This means you can modify the system time a program sees without having to change the time system-wide.


## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install libfaketime-env
```

## API

```javascript
const libfaketimeEnv = require('libfaketime-env');
```

### libfaketimeEnv()

Return: `Promise<Object>`

The resultant `Object` has a property `LD_PRELOAD` (on Linux, `DYLD_INSERT_LIBRARIES` on macOS) whose value is an absolute path where the libfaketime library is installed.

It first checks if the library is installed to `/usr/local/lib/faketime/`, then use [`dpkg-query --listfiles libfaketime`](https://manpages.debian.org/wheezy/dpkg/dpkg-query.1.en.html) command as a fallback. When it cannot locate the library, for example, because libfaketime is manually installed to a non-default path, the `Object` doesn't have either `LD_PRELOAD` or `DYLD_INSERT_LIBRARIES`.

On macOS, the `Object` also has `DYLD_FORCE_FLAT_NAMESPACE` property whose value is `'1'`.

```javascript
// On macOS
(async () => {
  await libfaketimeEnv(); /*=> {
    DYLD_INSERT_LIBRARIES: '/usr/local/Cellar/libfaketime/0.9.7_1/lib/faketime/libfaketime.1.dylib',
    DYLD_FORCE_FLAT_NAMESPACE: '1'
  } */
})();
```

The return value can be used with [`child_process`](https://nodejs.org/api/child_process.html) functions by passing it to the `env` option along with the `FAKETIME` environment variable.

```javascript
const {execFile} = require('child_process');
const {promisify} = require('util');
const libfaketimeEnv = require('libfaketime-env');

(async () => {
  const {stdout} = await promisify(execFile)('node', ['-p', 'new Date().toLocaleString("UTC")'], {
    env: {
      ...process.env,
      ...await libfaketimeEnv(),
      FAKETIME: '2012-03-04 05:06:07'
    }
  });
  //=> '2012/3/4 5:06:07\n', not the current date
})();
```

## License

[ISC License](./LICENSE) © 2019 Shinnosuke Watanabe
