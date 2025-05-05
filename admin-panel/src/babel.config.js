module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ],
      plugins: [
        [
          'module:dotenv-import',
          {
            moduleName: '@env',
            path: '.env',
            safe: false,
            allowUndefined: false,
          },
        ],
      ],
    };
  };
  