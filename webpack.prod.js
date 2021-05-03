const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const terserPlugin = require("terser-webpack-plugin");
const uglifyJs = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const optimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
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
				test: /\.css$/,
				use: [
					{
						loader: miniCssExtractPlugin.loader,
						options: {
							publicPath: "./img/",
						},
					},
					"css-loader",
				],
			},
			{
				test: /\.(svg|png|jpg|jpeg|webp)$/,
				use: {
					loader: "file-loader",
					options: {
						publicPath: "./img/",
						name: "[name].[ext]",
						outputPath: "./img/",
					},
				},
			},
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				styles: {
					name: "styles",
					test: /\.css$/,
					chunks: "all",
					enforce: true,
				},
			},
		},
		minimize: true,
		minimizer: [
			new optimizeCSSAssetsPlugin({
				cssProcessorOptions: { discardComments: { removeAll: true } },
				canPrint: true,
			}),
			new terserPlugin(),
			new uglifyJs(),
			new HtmlWebpackPlugin({
				template: "./App/index.html",
				minify: {
					removeAttributeQuotes: true,
					removeComments: true,
					collapseWhitespace: true,
				},
			}),
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new miniCssExtractPlugin({
			filename: "./style/css/[name].css",
		}),
		new PurgecssPlugin({
			paths: glob.sync(`${path.join(__dirname, "Dist")}/**/*`, { nodir: true }),
		}),
	],
});
