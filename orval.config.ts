const orvalConfig = {
  api: {
    input: './deps/api-specs/openapi.json',
    output: {
      target: './src/lib/api/generated',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/lib/api/client.ts',
          name: 'apiClient',
        },
      },
      clean: true,
      schemas: './src/lib/api/generated/models',
      mode: 'tags-split',
    },
    hooks: {
      afterAllFilesWrite: 'eslint --fix',
    },
  },
};

export default orvalConfig;
