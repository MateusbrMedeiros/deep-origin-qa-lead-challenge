import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://dummyjson.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {},
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'cypress/reports/mocha',
        overwrite: false,
        html: false,
        json: true,
      },
    },
  },
});
