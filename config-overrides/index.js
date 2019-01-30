const {
  override,
  addWebpackAlias,
  addBabelPlugin,
} = require('customize-cra');
const addLessLoader = require('./addLessLoader')
const useModernChromeInDev = require('./wrapReactAppPreset')
const { paths } = require('react-app-rewired')

module.exports = override(
  useModernChromeInDev(),
  addWebpackAlias({
    $src: paths.appSrc,
  }),
  addLessLoader(),
  addBabelPlugin([
    'import',
    {
      libraryName: 'antd-mobile',
      style: true,
      libraryDirectory: 'es',
    },
  ]),
)
