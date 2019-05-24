const path = require("path")
const { builtinModules } = require("module")
const fs = require("fs")
const nodeExternals = require("webpack-node-externals")
const detective = require("detective")
const r = path.resolve.bind(path, __dirname)

/** @type {import("webpack").Configuration} */
module.exports = {
  mode: "development",
  entry: r("./src/index.js"),
  output: {
    path: r("dist"),
    filename: "index.js",
    libraryTarget: "commonjs"
  },
  module: {
    noParse: [
      require.resolve(
        "translation-server/modules/zotero/chrome/content/zotero/xpcom/citeproc.js"
      )
    ],
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [require.resolve("./src/babel/zotero-require")]
            }
          },
          "transform-loader?brfs"
        ]
      }
    ]
  },
  resolve: {
    alias: {
      config: require.resolve("./src/shim/node-config")
    }
  },
  devtool: false,
  context: __dirname,
  target: "web",
  cache: true,
  externals: [
    nodeExternals({
      modulesDir: r("../node_modules"),
      whitelist: [/^translation-server/, "config"]
    }),
    ...require("module").builtinModules.filter(m => m !== "fs")
  ],
  node: {
    process: false,
    Buffer: false,
    fs: "empty",
    global: true,
    __filename: true,
    __dirname: true
  },
  plugins: [
    {
      apply: compiler => {
        compiler.hooks.done.tap("AfterEmitPlugin", () => {
          fs.copyFileSync(r("index.d.ts"), r("dist/index.d.ts"))

          const pkg = require("./package.json")
          const zotDeps = require("translation-server/package.json")
            .dependencies
          const outputDeps = new Set(
            detective(fs.readFileSync(r("dist/index.js")))
              .map(dep => dep.split("/")[0])
              .filter(
                dep =>
                  !dep.startsWith(".") &&
                  !builtinModules.includes(dep) &&
                  Object.keys(zotDeps).includes(dep)
              )
          )
          const outPkgDeps = {}
          for (const dep of outputDeps) outPkgDeps[dep] = zotDeps[dep]
          const outPkg = {
            ...pkg,
            dependencies: outPkgDeps,
            devDependencies: {},
            main: path.relative(r("dist"), r("dist/index.js")),
            types: path.relative(r("dist"), r("dist/index.d.ts"))
          }

          fs.writeFileSync(r("dist/package.json"), JSON.stringify(outPkg))
        })
      }
    }
  ]
}
