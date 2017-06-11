const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/register.html', to: "register.html" },
      { from: './app/login.html', to: "login.html" },
      { from: './app/home.html', to: "home.html" },
      { from: './app/addclaim.html', to: "addclaim.html" },
      { from: './app/claimdetail.html', to: "claimdetail.html" },
      { from: './app/myclaiminmap.html', to: "myclaiminmap.html" },
      { from: './app/myassociationclaiminmap.html', to: "myassociationclaiminmap.html" },
      { from: './app/myassociationquery.html', to: "myassociationquery.html" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
