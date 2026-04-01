import nextVitals from 'eslint-config-next/core-web-vitals';
import jsdoc from 'eslint-plugin-jsdoc';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'public/**',
      '.husky/**',
      'next-env.d.ts',
      'src/lib/api/generated/**',
      'src/components/ui/**',
    ],
  },

  ...nextVitals,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      jsdoc,
      'unused-imports': unusedImports,
      'import-x': importPlugin,
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'components', pattern: 'src/components/**' },
        { type: 'hooks', pattern: 'src/hooks/**' },
        { type: 'services', pattern: 'src/services/**' },
        { type: 'lib', pattern: 'src/lib/**' },
        { type: 'app', pattern: 'src/app/**' },
      ],
    },
    rules: {
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'import-x/no-cycle': 'error',

      'unused-imports/no-unused-imports': 'error',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/hooks/**/api/**'],
              message: 'Keep API logic inside Services or Data layers.',
            },
            {
              group: ['@/components/ui/**'],
              message: 'Use shared UI components instead of primitives.',
            },
          ],
        },
      ],

      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            { from: 'components', disallow: ['services'] },
            { from: 'hooks', disallow: ['services'] },
            { from: 'services', disallow: ['components'] },
          ],
        },
      ],

      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration', 'MethodDefinition'],
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },

  prettier,
];

export default eslintConfig;
