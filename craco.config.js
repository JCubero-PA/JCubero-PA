const CracoLessPlugin = require('craco-less');

// Archivo para sobreescritura de atributos en tema Ant Design
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#8A8A8A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};