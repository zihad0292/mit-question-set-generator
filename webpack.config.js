const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  // Tell webpack to start bundling our app at app/index.js
  entry: __dirname + "/resources/assets/js/index.js",
  // Output our app to the dist/ directory
  output: {
    filename: "app.js",
    path: __dirname + "/public/js"
  },
  // Emit source maps so we can debug our code in the browser
  devtool: "source-map",
  // Tell webpack to run our source code through Babel
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader
      //     },
      //     "sass-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         sourceMap: true,
      //         modules: true
      //       }
      //     }
      //   ]
      // }

      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
};
