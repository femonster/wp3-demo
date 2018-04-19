const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const mapArray = require('map-array');
// const { WebPlugin, AutoWebPlugin } = require('web-webpack-plugin');
const entrys = {
    login: ["./src/login/js/login.js"],
    entry: ["./src/entry/js/entry.js"]
};
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件名集合
let entryArr = mapArray(entrys, (key) => key);

entryArr.forEach((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `views/${page}.html`,
        template: path.resolve(__dirname, `./view/${page}.html`),
        chunks: [page, 'commons']
    });
    HTMLPlugins.push(htmlPlugin);
})

module.exports = {
    entry: entrys,
    // entry: './main.js',
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: '[name]_[hash:8].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
                // 用正则去匹配要用该 loader 转换的 CSS 文件,minimize指开启压缩
                test: /\.(css|scss)$/,
                // use: ['style-loader', 'css-loader', 'sass-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }, {
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['babel-loader'],
            }, {
                test: /\.art$/,
                loader: "art-template-loader",
                options: {
                    // art-template options (if necessary)
                    // @see https://github.com/aui/art-template
                }
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '/fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(["dist"]),
        // 从 .js 文件中提取出来的 .css 文件的名称
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`,
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './static'),
            to: 'static',
            ignore: ['.*']
        }]),
        // 压缩输出的 JS 代码
        new UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        // 自动生成 HTML 插件
        ...HTMLPlugins
    ],
    devtool: 'source-map'
}