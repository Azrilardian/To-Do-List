const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");
const uglifyJs = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
			//? Babel Loaders
			{
				test: /\.js$/,
				exclude: "/node_modules/",
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
			{
				test: /\.(svg|png|jpg|jpeg)$/,
				use: {
					loader: "file-loader",
					options: {
						publicPath: (resourcePath, context) => {
							return path.relative(path.dirname(resourcePath), context) + "";
						},
						name: "[name].[ext]",
						outputPath: "./assets",
					},
				},
			},
		],
	},
	plugins: [new OptimizeCSSAssetsPlugin(), new CleanWebpackPlugin()],
	optimization: {
		minimize: true,
		minimizer: [new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { map: { inline: false, annotation: true } } }), new terserPlugin(), new uglifyJs()],
	},
});
