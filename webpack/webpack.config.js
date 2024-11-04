const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const DoneWebpackPlugin = require('done-webpack-plugin');
const eslintFormater = require('eslint-friendly-formatter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const ESLintPlugin = require('eslint-webpack-plugin')

let chunkVersions = {};

const dynTemplateDir = path.resolve(__dirname, '../src/templates/dynamic');

if (!fs.existsSync(dynTemplateDir)){
    fs.mkdirSync(dynTemplateDir);
}

const loaders = {
  TsLoader: {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    },
  },

  TsLintLoader: {
    test: /\.(ts|tsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          eslintPath: require.resolve('eslint'),
          formatter(errs) {
            return eslintFormater(errs) +
              '\nUse "// eslint-disable-line <error_name>" or "// eslint-disable-next-line <error_name>"\n' +
              '\x07'; // gives sound under windows
          },
          emitWarning: true,
          configFile: path.resolve(__dirname, './tseslintrc.js')

        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    exclude: /node_modules/,
  },
  StyleLoader: {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
        },
      },
      {
        loader: 'css-loader',
        options: {
          url: false,
        },
      },
      'sass-loader',
    ],
  },
  FileLoader: {
    test: /\.(woff|woff2|eot|ttf|svg)$/,
    loader: 'file-loader',
    options: { name: '[name].[ext]', outputPath: 'fonts/', }
  },
  vueLoader: {
    test: /\.vue$/,
    loader: 'vue-loader',
  },
};

module.exports = {
  context: __dirname,
  entry: {
    // react_app: [
    //   path.resolve(__dirname, '../src/frontend/react/App/index.tsx'),
    // ],
    vue_app: [
      path.resolve(__dirname, '../src/frontend/vue/main.ts'),
    ],
    styles_app: [
      path.resolve(__dirname, '../src/frontend/sass/main.scss'),
    ],
  },
  output: {
    path: path.resolve(__dirname, '../src/static/webpack_bundles/'),
    publicPath: 'auto', // necessary for CDNs/S3/blob storages
    filename: '[name].js',
  },
  module: {
    rules: [
      loaders.TsLoader,
      loaders.TsLintLoader,
      loaders.vueLoader,
      loaders.StyleLoader,
      loaders.FileLoader,
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_main.css',
    }),
    /*
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../src/static/fonts/'),
        to: 'files/',
      }],
    }),
    */
    new VueLoaderPlugin(),
    new DoneWebpackPlugin((stats) => {
      const changedChunks = stats.compilation.chunks.filter(function(chunk) {
        const oldVersion = chunkVersions[chunk.name];
        chunkVersions[chunk.name] = chunk.hash;
        return chunk.hash !== oldVersion;
      });
      if (changedChunks.length) {
        const hash = stats.hash;
        const fileOutJs = path.resolve(__dirname, '../src/templates/dynamic/build_hash.txt');
        fs.writeFileSync(fileOutJs, hash);
      }
      console.log('\x07');
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue'],
    modules: [path.resolve(__dirname, '../src/frontend/react'), path.resolve(__dirname, '../src/frontend/vue'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, '../src/frontend/vue'),
      vue: path.resolve(__dirname, '../node_modules/vue/dist/vue.esm-browser.js'),
    }
  }
};
