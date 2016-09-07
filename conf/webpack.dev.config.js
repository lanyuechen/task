var config = require('./webpack.config')

config.devtool = 'eval-source-map'

config.devServer = {
  noInfo: true
}

module.exports = config