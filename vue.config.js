// var vConsolePlugin = require('vconsole-webpack-plugin');
module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: 'https://www.okex.me/api/index/v3/instruments/'
    // proxy: {
    //   '/api': {
    //     ws: false,
    //     target: 'http://14.116.172.69:18004',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  }
};
