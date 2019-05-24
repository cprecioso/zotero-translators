# zotero-translators

## Description

The citation manager [Zotero](https://www.zotero.org) provides a collection of
[translators](https://www.zotero.org/support/dev/translators) that manage
detection, import and export of reference items.

However, these translators depend on the Zotero app's environment and are not
standalone. There exists the
[`translation-server`](https://github.com/zotero/translation-server) project to
run them in Node.js, within an HTTP server.

**This project hooks up into the `translation-server` module to provide access
to the translators as regular JS functions, without the need to set up an HTTP
server.**

## Usage

```js
const translators = require("zotero-translators")

translators
  .search("http://dx.doi.org/10.3109/07434618.2014.906498")
  .then(references => console.log(references))
```

## Installation

```sh
$ npm install zotero-translators
# or
$ yarn add zotero-translators
```

This module is made for Node.js. Might work in browser, but might not be
optimal.

## API

The API is _really_ straightforward, you can check it in the
[typings file](./package/index.d.ts). If there is a need to further document or
clarify the API,
[file an issue](https://github.com/cprecioso/zotero-translators/issues/new).

## Known issues

It might work on browsers, through [`webpack`](https://webpack.js.org),
[`browserify`](http://browserify.org), [`parcel-bundler`](https://parceljs.org),
or similar. However, it has not been tested with any of them, so exercise
caution. Also, on load, this module includes _all_ of the
[more than 500 translators](https://github.com/zotero/translators) that Zotero
has. This might not be optimal for web browsing applications.
[Further discussion here.](https://github.com/cprecioso/zotero-translators/issues/1)

It is also missing the `web` function.
[Further discussion here.](https://github.com/cprecioso/zotero-translators/issues/3)
