const path = require('path');

module.exports = {
  entry: './src/index.js',  // Atualize isso com o arquivo de entrada correto
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Aplica-se a arquivos .js
        exclude: /node_modules/,  // Exclui a pasta node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],  // Usa o preset para compilar ES6+
          },
        },
      },
      {
        test: /\.mjs$/,  // Adiciona suporte para arquivos .mjs (modular JavaScript)
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.mjs'],  // Adiciona suporte para arquivos mjs
  },
};
