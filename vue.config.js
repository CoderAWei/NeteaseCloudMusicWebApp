'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionPlugin = require('compression-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const { merge } = require('webpack-merge')
const isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

// const cdn = {
//   // 忽略打包的第三方库
//   externals: {
//     vue: 'Vue',
//     vuex: 'Vuex',
//     'vue-router': 'VueRouter',
//     axios: 'axios'
//     // 'element-ui': 'ELEMENT',
//     // echarts: 'echarts'
//   },
//   js: [
//     'https://cdn.jsdelivr.net/npm/vue', // Vue
//     'https://cdn.jsdelivr.net/npm/vue-router@3.0.3/dist/vue-router.min.js', // vue-router
//     'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js', // Vuex
//     'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js' // axios
//     // 'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/index.js', // element-ui
//     // 'https://cdn.jsdelivr.net/npm/echarts@4.9.0/dist/echarts.min.js' // echarts
//   ],
//   css: [
//     // 'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/index.css'
//   ]
// }

const name = defaultSettings.title || '淦霖酿' // page title

const port = process.env.port || process.env.npm_config_port || 8001 // dev port

module.exports = {
  parallel: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: !isProduction,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'https://www.xzw999.com/music/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  css: { // 共享全局样式变量
    loaderOptions: {
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  },
  transpileDependencies: [ // 兼容IE11
    'vuex-module-decorators'
  ],
  configureWebpack: config => {
    config.name = name
    if (isProduction) { // 生产环境
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css)?$/i, // 需要压缩的文件类型
          threshold: 4960, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
          minRatio: 0.5
        })
      )
      // config.externals = cdn.externals
    } else { // 开发环境

    }
  },
  chainWebpack(config) {
    // 配置VantUI按需引入
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        })
        return options
      })

    config.resolve.alias
      .set('@', resolve('src'))

    // CDN
    // if (isProduction) {
    //   config.plugin('html').tap((args) => {
    //     args[0].cdn = cdn
    //     return args
    //   })
    // }
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // config
    //   .when(process.env.NODE_ENV !== 'development',
    //     config => {
    //       config
    //         .plugin('ScriptExtHtmlWebpackPlugin')
    //         .after('html')
    //         .use('script-ext-html-webpack-plugin', [{
    //         // `runtime` must same as runtimeChunk name. default is `runtime`
    //           inline: /runtime\..*\.js$/
    //         }])
    //         .end()
    //       config
    //         .optimization.splitChunks({
    //           chunks: 'all',
    //           cacheGroups: {
    //             libs: {
    //               name: 'chunk-libs',
    //               test: /[\\/]node_modules[\\/]/,
    //               priority: 10,
    //               chunks: 'initial' // only package third parties that are initially dependent
    //             },
    //             elementUI: {
    //               name: 'chunk-elementUI', // split elementUI into a single package
    //               priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //               test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
    //             },
    //             commons: {
    //               name: 'chunk-commons',
    //               test: resolve('src/components'), // can customize your rules
    //               minChunks: 3, //  minimum common number
    //               priority: 5,
    //               reuseExistingChunk: true
    //             }
    //           }
    //         })
    //       // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
    //       config.optimization.runtimeChunk('single')
    //     }
    //   )
  }
}
