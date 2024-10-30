const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'feijbi',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
