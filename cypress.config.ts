import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://dummyjson.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
