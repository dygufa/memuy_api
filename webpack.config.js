var webpack = require("webpack");
var nodeExternals = require("webpack-node-externals");

var rules = [{
    test: /\.ts$/,
    enforce: "pre",
    use: [{
        loader: "tslint-loader"
    }]
}, {
    test: /\.ts$/,
    use: [{
        loader: "babel-loader",
        options: {
            presets: ["es2015", "es2016", "es2017"],
            plugins: ["transform-runtime"]
        }
    }, {
        loader: "awesome-typescript-loader"
    }]
}];

module.exports = [{
    entry: "./src/memuy.ts",
    target: "node",
    output: { path: __dirname, filename: "out/memuy.js" },
    module: { rules },
    externals: [ nodeExternals() ],
    resolve: { extensions: [".ts", ".tsx"] }
}];
