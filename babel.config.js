module.exports = {
    presets: [
        "presets": ["@babel/preset-react"]
    ],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',  // Necessário para o "export * as"
      '@babel/plugin-transform-runtime',  // Melhora a compatibilidade com código moderno
    ],
    env: {
      test: {
        presets: ['@babel/preset-env'],
      },
    },
  };
  