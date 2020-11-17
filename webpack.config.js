const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  entry: {
    path: "./src/js/index.js"
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('./dist'),
    publicPath: 'dist'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.html$/,
        loader: "file-loader",
        options: {
          name: '[name].[ext]'
        },
        exclude: path.join(__dirname, 'src/index.html')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template:  path.resolve('./src/index.html'),
      chunks: []
    }),
    new CleanWebpackPlugin(),
  ],
}