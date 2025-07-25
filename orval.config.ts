export default {
  'smart-salons-api': {
    input: {
      target: 'http://localhost:5555/api/docs-json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/lib/api/generated',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: 'src/lib/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
