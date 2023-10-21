const Dotenv = require('dotenv-webpack');
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  }
}
