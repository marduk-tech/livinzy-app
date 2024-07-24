import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

export const TYPESENSE_HOST = import.meta.env.VITE_TYPESENSE_HOST;
export const TYPESENSE_PORT = import.meta.env.VITE_TYPESENSE_PORT;
export const TYPESENSE_PROTOCOL = import.meta.env.VITE_TYPESENSE_PROTOCOL;
export const TYPESENSE_SEARCH_API_KEY = import.meta.env
  .VITE_TYPESENSE_SEARCH_API_KEY;

const config = {
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: TYPESENSE_PORT,
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  // Todo add search only api key
  apiKey: TYPESENSE_SEARCH_API_KEY,
  connectionTimeoutSeconds: 5,
  numRetries: 8,
};

export const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: config,

  additionalSearchParameters: {
    query_by:
      "spaceName, fixtureName, projectName, features, function, color, objectType, style",
    query_by_weights: "4, 3, 2, 2, 2, 2, 2, 2",
    num_typos: 3,
    typo_tokens_threshold: 1,
  },
});

export const searchClient = typesenseAdapter.searchClient;
