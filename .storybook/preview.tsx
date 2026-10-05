import type { Preview } from '@storybook/nextjs-vite';
import { configure } from '@storybook/test';
import { Bricolage_Grotesque, Sora, Playfair_Display } from 'next/font/google';
import { initialize, mswLoader } from 'msw-storybook-addon';

import '../src/app/globals.css';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect } from 'react';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const isSubpath = window.location.pathname.startsWith('/village_website');
const baseUrl = isSubpath ? '/village_website/' : '/';

configure({
  getElementError(message) {
    const cleanMessage = message ? message.split('Ignored nodes:')[0] : '';
    const error = new Error(`${cleanMessage.trim()}\n\n(DOM tree output truncated)`);
    error.name = 'TestingLibraryElementError';
    return error;
  },
});

initialize({
  quiet: true,
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${baseUrl}mockServiceWorker.js`,
  },
});

const preview: Preview = {
  parameters: {
    nextjs: {
      image: {
        unoptimized: true,
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        const classes = [
          bricolage.variable,
          sora.variable,
          playfair.variable,
          'font-sans',
          'antialiased',
        ];

        document.body.classList.add(...classes);

        return () => {
          document.body.classList.remove(...classes);
        };
      }, []);

      return <Story />;
    },
  ],
  loaders: [mswLoader],
};

export default preview;
