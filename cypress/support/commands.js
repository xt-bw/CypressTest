// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

	cy.visit('/')
	cy.contains('AuraPay ログイン')
	cy.get('#loginid').type(username)
	cy.get('#password').type(password)
    cy.get('.fsS.pt2').click()
    cy.get('#submitbtn').click()
	cy.contains('二段階認証')
	cy.get('input#verifyCode').type(randomNumber.toString(), {force: true})
	cy.get('#validBtn').click()
	cy.url().should('include', '/account')
	cy.contains('口座情報がご確認いただけます')
  })
})

// Cypress.Commands.add('preserveSession', () => {
//   Cypress.Cookies.defaults({
//     preserve: 'loginid', // Replace with your app's session cookie name devaurapay ipqsd device_id_1737280475 _ga_XH859PRJRY _ga
//   });
// });



