import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default tseslint.config({
  files: ['**/*.ts'], // Aplica-se a arquivos TypeScript.

  extends: [
    eslint.configs.recommended, // Regras JS recomendadas.
    ...tseslint.configs.recommendedTypeChecked, // Regras TS com verificação de T
    prettier, // Desativa regras conflitantes com o Prettier.
  ],

  ignores: ['/build/*'],

  languageOptions: {
    parserOptions: {
      project: true, // Habilita linting baseado em tipo.
      tsconfigRootDir: import.meta.dirname, // Define o dir raiz do tsconfig
    },
  },

  plugins: {
    '@stylistic': stylistic, // Plugin para regras de estilo.
  },

  rules: {
    '@stylistic/semi': 'error', // Exige ponto e vírgula.
    // Proíbe atribuições 'any' não seguras.
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error', // Proíbe o uso de 'any'.
    // Não exige tipo de retorno explícito para funções.
    '@typescript-eslint/explicit-function-return-type': 'off',
    // Não exige tipos para exportações de módulo.
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Desativa restrição de tipos em template literals.
    '@typescript-eslint/restrict-template-expressions': 'off',
    // Desativa restrição de tipos na operação '+'.
    '@typescript-eslint/restrict-plus-operands': 'off',
    // Proíbe vars não usadas, ignora args com '_'.
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
});
