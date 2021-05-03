const path = require("path");

module.exports = {
	entry: "./App/js/index.js",
	output: {
		path: path.resolve(__dirname, "Dist"),
		filename: "bundle.js",
	},
};
