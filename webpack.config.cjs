const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader , "css-loader"]
          },
          {
            test: /\.png/,
            type: 'asset/resource'
          },
          {
            test: /\.html$/,
            type: 'asset/source'
          }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin()],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        }
    }
};
