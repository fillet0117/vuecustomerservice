let publicPath = "/";
module.exports = {
  pluginOptions: {
    i18n: {
      locale: "ch",
      fallbackLocale: "ch",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
  devServer: {
    publicPath, // 和 publicPath 保持一致
    proxy: {
      "/api": {
        target: "http://vip66741.com/api",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
