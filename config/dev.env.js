const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.0.2:9527/api"',
  SOCKET_API: '"ws://192.168.0.2:9502"'
})
