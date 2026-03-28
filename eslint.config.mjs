import nextVitals from 'eslint-config-next/core-web-vitals';
import jsdoc from 'eslint-plugin-jsdoc';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';

const eslintConfig = [
  // Ignore build artifacts
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'public/**',
      '.husky/**',
      'next-env.d.ts',
    ],
  },

  // Next.js base rules
  ...nextVitals,

  // TypeScript rules
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
      // Define architecture layers
      'boundaries/elements': [
        { type: 'components', pattern: 'src/components/**' },
        { type: 'hooks', pattern: 'src/hooks/**' },
        { type: 'services', pattern: 'src/services/**' },
        { type: 'lib', pattern: 'src/lib/**' },
        { type: 'app', pattern: 'src/app/**' },
      ],
    },
    rules: {
      // Async safety
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Type imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Import sorting
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Prevent circular imports
      'import-x/no-cycle': 'error',

      // Remove unused imports automatically
      'unused-imports/no-unused-imports': 'error',

      // Architecture guardrails
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

      // Architecture layers
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

      // JSDoc rules
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

  // Test overrides
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // Prettier must be last
  prettier,
];

export default eslintConfig;
