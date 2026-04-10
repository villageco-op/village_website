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
  viteFinal: async (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      config.base = '/village_website/';
    }

    config.define = {
      ...config.define,
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify('https://api.mock'),
    };

    return config;
  },
};
export default config;
