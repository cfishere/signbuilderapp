import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://sbapp.test',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
});