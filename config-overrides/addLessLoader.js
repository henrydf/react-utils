const { paths } = require('react-app-rewired')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// copy defines from react-scripts/config/webpack.config.js
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// In development, we always serve from the root. This makes config easier.
const publicPath = isEnvProduction
  ? paths.servedPath
  : isEnvDevelopment && '/';
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
      ),
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    });
  }
  return loaders;
};

module.exports = () => (config, env) => {
  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  const lessLoader = [
    ...getStyleLoaders({
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    }),
    {
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: isEnvProduction && shouldUseSourceMap,
        javascriptEnabled: true,
      },
    },
  ]

  const lessModuleLoader = [
    ...getStyleLoaders(
      {
        importLoaders: 2,
        sourceMap: isEnvProduction && shouldUseSourceMap,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      },
    ),
    {
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: isEnvProduction && shouldUseSourceMap,
        javascriptEnabled: true,
      },
    },
  ]

  // Insert less-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(loaders.length - 1, 0, {
    test: /\.less$/,
    exclude: /\.module\.less$/,
    use: lessLoader,
    sideEffects: isEnvProduction,
  });
  loaders.splice(loaders.length - 1, 0, {
    test: /\.module\.less$/,
    use: lessModuleLoader,
    sideEffects: isEnvProduction,
  });

  return config;
}
