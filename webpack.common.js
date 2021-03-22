const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./App/js/index.js",
	output: {
		path: path.resolve(__dirname, "Dist"),
		filename: "bundle.js",
	},
	//? Module
	module: {
		rules: [
			//? Css Loader
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	//? Plugin
	plugins: [
		//? Html Webpack Plugin
		new htmlWebpackPlugin({
			template: "./App/index.html",
			filename: "index.html",
		}),
	],
};
