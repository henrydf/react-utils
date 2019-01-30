const configer = require('babel-preset-react-app')
module.exports = function(api, opts) {
  const config = configer(api, opts)
  config.presets = config.presets.map(
    (preset) => {
      const [, option] = preset
      if (option && option.targets) {
        preset[1] = {
          ...option,
          targets: {
            browsers: 'last 1 Chrome versions',
          }
        }
      }
      return preset
    }
  )
  return config
}
