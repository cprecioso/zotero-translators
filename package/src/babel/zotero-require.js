const { dirname, resolve } = require("path")

const REQUIRE_PREFIX = resolve(
  dirname(require.resolve("translation-server/package.json")),
  "./modules/zotero/chrome/content/zotero/xpcom/"
)

module.exports = function(/** @type {import("@babel/core")} */ babel) {
  const { types: t } = babel

  return {
    name: "zotero-require",
    visitor: {
      MemberExpression(
        /** @type {import("@babel/traverse").NodePath<import("@babel/types").CallExpression>} */ path
      ) {
        if (
          !(
            path.get("object").isIdentifier({ name: "Zotero" }) &&
            path.get("property").isIdentifier({ name: "require" })
          )
        )
          return

        if (path.parentPath.isCallExpression()) {
          path.parent.callee = t.identifier("require")
          path.parent.arguments[0] = t.stringLiteral(
            resolve(REQUIRE_PREFIX, path.parent.arguments[0].value)
          )
        } else if (path.parentPath.isAssignmentExpression) {
          path.parentPath.remove()
        }
      }
    }
  }
}
