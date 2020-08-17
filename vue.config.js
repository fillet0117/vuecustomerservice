let publicPath = "/";
module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
  devServer: {
    publicPath, // 和 publicPath 保持一致
    proxy: {
      "/api": {
        target: "http://192.168.2.87:83/api",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
