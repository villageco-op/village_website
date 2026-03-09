const orvalConfig = {
  api: {
    input: './openapi.json',
    output: {
      target: './src/lib/api/generated',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/lib/api/client.ts',
          name: 'apiClient',
        },
      },
    },
  },
};

export default orvalConfig;
