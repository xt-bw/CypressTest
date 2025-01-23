const { defineConfig } = require("cypress");
const fs = require('fs')

module.exports = defineConfig({
  retries: 2, // total 3 attempts // all modes
  // retries: {
  //   // Configure retry attempts for `cypress run`
  //   // Default is 0
  //   runMode: 2,
  //   // Configure retry attempts for `cypress open`
  //   // Default is 0
  //   openMode: 0,
  // },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
    baseUrl: 'https://aurapay-front.minxpay.com/ws3',
    env: {
      email: 'atXT2408271531@outlook.com', // hv address // atXT2406206516@hotmail.com',
      password: 'Asdf@123',
      // txnCode: 'HzyajKlL',
      // loginId: 348,
      env: 'local', // dev
      mailPersonal: 'lihua.sheng@outlook.com',
      mailMerchant: 'bailee2024@hotmail.com',
      mailMerchantInvalid: 'test23+testmy-B30@t.aurapay.com',
    },
  },
  defaultCommandTimeout: 30000, // 30 seconds
  video: true,
  viewportWidth: 1280, //1000,
  viewportHeight: 720, //600,
});
