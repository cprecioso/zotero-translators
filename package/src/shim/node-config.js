// @preval

const fs = require("fs")
const vm = require("vm")
const path = require("path")

const translationServerRoot = path.dirname(
  require.resolve("translation-server/package.json")
)
const configContents = fs.readFileSync(
  path.resolve(translationServerRoot, "config/default.json"),
  "utf8"
)
const config = vm.runInNewContext(`(${configContents})`, {})

config.translatorsDirectory = path.resolve(
  translationServerRoot,
  "modules/translators"
)

module.exports = {
  ...config,
  has: key => module.exports[key] !== undefined,
  get: key => module.exports[key]
}
