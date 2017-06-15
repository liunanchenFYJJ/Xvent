function buildConfig(env) {
  return require('./webpack-config/config.' + env + '.js')(env)
}

module.exports = buildConfig;