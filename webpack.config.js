
'use strict';
const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");  //css单独打包

module.exports = {
    devtool: 'eval-source-map',
    entry: __dirname + '/src/main.jsx', //唯一入口文件
    output: {
        path: __dirname + '/build', //打包后的文件存放的地方
        filename: 'bundle.js' //打包后输出文件的文件名
    },
    module: {
        loaders: [
            {
               test: /\.jsx?$/,
               exclude: /node_modules/,
               loader: 'babel',
               query: {
                  presets: ['es2015', 'stage-0', 'react'],
                  plugins: ['transform-runtime']
               }
            },
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")},
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192'}
        ]
    },
    postcss: [
        require('autoprefixer')    //调用autoprefixer插件,css3自动补全
    ],
    devServer: {
        // contentBase: './src/views'  //本地服务器所加载的页面所在的目录
        port: 8888,
        colors: true,  //终端中输出结果为彩色
        historyApiFallback: true,  //不跳转
        inline: true  //实时刷新
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
           'process.env':{
             'NODE_ENV': JSON.stringify('production')
           }
       })
    ]
}
