//Webpack requires this to work with directories
const path =  require('path');
// khai báo sử dụng html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// This is main configuration object that tells Webpackw what to do.
module.exports = {
    //path to entry paint
    entry:  {
      main: ['./src/main.js', './src/scene/scene1.js', './src/scene/scene2.js'],
      vendor: ['phaser'],
    },
    //path and filename of the final output
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: { // khai báo và cấu hình Module cần sử dụng.
      rules: [
        {
          test: /\.js$/, // áp dụng với chỉ file có định dạng js
          exclude: /node_modules/, // Module sẽ bỏ qua thư mục node_modules
          use: {
            loader: "babel-loader" // Module sử dụng babel-loader.
          },
        },
        // Thêm multi module loader
        {
          test: /\.scss$/, // chỉ làm việc với file có định dạng scss
          use: ["style-loader", "css-loader","sass-loader"] // danh sách module loader
        }
      ]
    },
    // Bắt đầu từ đây, cấu hình Development Web Server.
    devServer: {
      // cái contentBase này mình không hiểu ý nghĩa nó lắm, nên tạm thời commemt lại :))
      // contentBase: path.join(__dirname, 'dist'),
      port: 8080, // port mặc định là 8080 nhé các bạn.
      inline: true, // cái này là Live Reloading, thiết lập theo kiểu boolean.

      hot:true, // cái này là Hot Module Replacement, thiết lập theo kiểu boolean.

      open: true, // Khi chạy lệnh để chạy devServer thì cái trình duyệt sẽ mở chạy luôn,
      //thiết lập theo kiểu boolean hoặc string là cái trình duyệt bạn muốn mở.
      //Ví dụ : 'Chrome'..
    },
    // khai báo sử dụng plugin
    plugins: [
    // danh sách plugin bạn cần sử dụng sẽ nằm trong này.
    // sử dụng plugin HtmlWebpackPlugin
    // new plugin_sử_dung(cấu hình plugin đó)
      new HtmlWebpackPlugin({ template: './index.html',title: 'Start Webpack'}),
    // sử dụng plugin CopyWebpackPlugin
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'index.html'),
          to: path.resolve(__dirname, 'dist')
        },
        {
          from: path.resolve(__dirname, 'assets', '**', '*'),
          to: path.resolve(__dirname, 'dist')
        }
      ]),
      new webpack.DefinePlugin({
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true)
      }),
    ],
    //default mode is production
    mode: 'development',
    optimization: {
      concatenateModules: true,
      minimize: true,
 }
}
