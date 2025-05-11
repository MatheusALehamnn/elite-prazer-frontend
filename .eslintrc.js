module.exports = {
    extends: 'next/core-web-vitals',
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn', // Reduz de erro para aviso
      '@typescript-eslint/no-explicit-any': 'off', // Desativa a regra de any
      'react/no-unescaped-entities': 'off', // Desativa a regra de entidades não escapadas
      '@next/next/no-img-element': 'warn' // Reduz de erro para aviso
    }
  }