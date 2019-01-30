module.exports = () => (config, env) => {
  if (env === 'development') {
    const { getBabelLoader } = require('customize-cra')
    const loader = getBabelLoader(config)
    loader.options.presets = loader.options.presets.map(
      (preset) => {
        if (preset.indexOf('/babel-preset-react-app/') >= 0) {
          return `${process.cwd()}/preset-react-app-wrapper.js`
        } else {
          return preset
        }
      }
    )
  }
  return config
}
