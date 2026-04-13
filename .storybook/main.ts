import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';

const dirname = import.meta.dirname;

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: [path.join(dirname, '../public')],
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_API_URL: 'https://api.mock',
    NEXT_PUBLIC_BASE_PATH: '/',
  }),
  viteFinal: async (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      config.base = '/village_website/';
    }

    config.define = {
      ...config.define,
      'process.env': {
        NEXT_PUBLIC_API_URL: 'https://api.mock',
        NEXT_PUBLIC_BASE_PATH: '/',
        NODE_ENV: JSON.stringify((configType || 'PRODUCTION').toLowerCase()),
      },
    };

    return config;
  },
};
export default config;
