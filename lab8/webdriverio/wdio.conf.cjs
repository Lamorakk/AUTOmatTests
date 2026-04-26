const path = require("node:path");

/** @type {import('@wdio/types').Options.Testrunner} */
exports.config = {
  runner: "local",
  specs: [path.join(__dirname, "tests", "specs", "todomvc-ui.spec.cjs")],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["headless=new", "disable-gpu", "no-sandbox", "disable-dev-shm-usage", "window-size=1280,800"],
      },
    },
  ],
  logLevel: "warn",
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 120_000,
  },
};
