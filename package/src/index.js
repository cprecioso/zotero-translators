require("translation-server/src/zotero")
require("translation-server/src/debug").init(
  process.env.DEBUG_LEVEL ? parseInt(process.env.DEBUG_LEVEL) : 1
)
require("translation-server/src/http")
const Translators = require("translation-server/src/translators")
const Translate = require("translation-server/src/translation/translate")
const { FORMATS } = require("translation-server/src/formats")

Translators.init(require("./shim/translators"))

const push = Array.prototype.push

export async function search(query) {
  let identifiers = Zotero.Utilities.Internal.extractIdentifiers(query)
  if (!identifiers.length) throw new Error("No identifiers found")
  const selectedIdentifier = identifiers[0]
  const translate = new Translate.Search()
  translate.setIdentifier(selectedIdentifier)
  const translators = await translate.getTranslators()
  if (!translators.length) throw new Error("No translators available")
  translate.setTranslator(translators)
  const items = await translate.translate({
    libraryID: false
  })
  const exportableItems = items.reduce((arr, i) => {
    push.apply(arr, Zotero.Utilities.itemToAPIJSON(i))
    return arr
  }, [])
  return exportableItems
}

export async function referenceImport(data) {
  const translate = new Translate.Import()
  translate.setString(data)
  const translators = await translate.getTranslators()
  if (translators.length === 0) throw new Error("No suitable translators found")
  translate.setTranslator(translators[0])
  const items = await translate.translate({ libraryID: 1 })
  const exportableItems = items.reduce((arr, i) => {
    push.apply(arr, Zotero.Utilities.itemToAPIJSON(i))
    return arr
  }, [])
  return exportableItems
}

export async function referenceExport(format, items) {
  const translatorID = FORMATS[format]
  for (let item of items) {
    if (!item.uri) {
      item.uri = item.key
      delete item.key
    }
  }
  var translate = new Translate.Export()
  translate.setTranslator(translatorID)
  translate.setItems(items)
  await new Promise((f, r) => {
    translate.setHandler("done", (_, status) => (status ? f : r)())
    translate.translate()
  })
  return translate.string
}
