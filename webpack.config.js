const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"))).version;
const WebpackShellPlugin = require("webpack-shell-plugin");

var config = {
    // entry: {
    //     app: ["./index.ts"]
    // },
    // watch: true,
    // devtool: "inline-source-map",
    // output: {
    //     path: path.resolve(__dirname, "dist"),
    //     filename: "ifvisible.js",
    //     libraryTarget: "umd"
    // },
    // resolve: {
    //     extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    // },
    // module: {
    //     loaders: [{
    //         test: /\.tsx?$/, loader: "ts-loader"
    //     }]
    // },
    // plugins: [
    //     new webpack.DefinePlugin({
    //         __VERSION__: JSON.stringify(version)
    //     })
    // ],


    context: __dirname,
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: {
        app: ["./index.ts"]
    },
    watch: true,
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        libraryTarget: "umd"
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(version)
        })
    ],
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"}
        ]
    }
}

if (process.env.PURPOSE === "production") {
    console.log("Production Mode");
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());

    config.devtool = false;
    config.watch = false;
}

config.plugins.push(new WebpackShellPlugin({
    dev: false,
    onBuildEnd: ['cp ./dist/ifvisible.js ./docs/']
}));

module.exports = config;
