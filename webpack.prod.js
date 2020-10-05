const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
			//? Babel Loaders
			{
				test: /\.js$/,
				exclude: "/node_modules/",
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
				],
			},
		],
	},
});
