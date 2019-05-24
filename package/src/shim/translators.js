// @preval

const deasync = require("deasync")

process.env["NODE_CONFIG"] = JSON.stringify(require("./node-config"))

require("translation-server/src/zotero")
require("translation-server/src/debug").init(
  process.env.DEBUG_LEVEL ? parseInt(process.env.DEBUG_LEVEL) : 1
)
require("translation-server/src/webSession")
const Translators = require("translation-server/src/translators")
require("translation-server/src/translation/translate")

let done = false
let data
let err

Translators.load().then(
  newData => {
    done = true
    data = newData
  },
  newErr => {
    done = true
    err = newErr
  }
)

deasync.loopWhile(() => !done)

if (err) throw err

module.exports = data
