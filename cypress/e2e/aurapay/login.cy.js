// import { getTimestamp } from '../../utils/allUtils';
import { getScnshotName } from '../../utils/allUtils';
// import { faker } from '@faker-js/faker';

describe('AuraPay Login', () => {
  context('Desktop 1280 x 720', () => {
    beforeEach(() => {
      // cy.viewport(1280, 720) // def 1000x660
      cy.visit('/')
      cy.contains('AuraPay ログイン')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login')}`)
    })

    it('Error - Wrong credentials', () => {
      // incorrect email
      cy.get('#loginid').type(Cypress.env('email') + 'm')
      cy.get('#password').type(Cypress.env('password'))
      cy.get('.fsS.pt2').click()
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_IncorrectEmail')}`)
      // incorrect pw
      cy.get('#loginid').clear().type(Cypress.env('email'))
      cy.get('#password').clear().type(Cypress.env('password') + 3)
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_IncorrectPassword')}`)
    })

    it('Error - Empty email/password', () => {
      // incorrect email
      // cy.get('#loginid').type('')
      cy.get('#password').type(Cypress.env('password'))
      cy.get('.fsS.pt2').click()
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_EmptyEmail')}`)
      // incorrect pw
      cy.get('#loginid').type(Cypress.env('email'))
      cy.get('#password').clear()
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_EmptyPassword')}`)
    })

    it('Can login', () => {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      // Log for debugging
      cy.log(`Generated Random Number: ${randomNumber}`);

      cy.get('#loginid').type(Cypress.env('email'))
      cy.get('#password').type(Cypress.env('password'))
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FA')}`)
      cy.get('#submitbtn').click()
      cy.contains('二段階認証')
      // cy.get('input#verifyCode').type(randomNumber.toString(), {force: true})
      // cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FA')}`)
      // cy.get('#validBtn').click()
      // cy.contains('口座情報がご確認いただけます')
      // cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FA')}`)
      // cy.get('.nav-item.nav-logout').click()
      // cy.contains('AuraPay ログイン')
    })




  })

  context('Iphone X - 375 x 812', () => {
    beforeEach(() => {
      cy.viewport('iphone-x') 
      cy.visit('/')
      cy.contains('AuraPay ログイン')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login')}`)
    })

    it('Error - Wrong credentials', () => {
      // incorrect email
      cy.get('#loginid').type(Cypress.env('email') + 'm')
      cy.get('#password').type(Cypress.env('password'))
      cy.get('.fsS.pt2').click()
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_IncorrectEmail')}`)
      // incorrect pw
      cy.get('#loginid').clear().type(Cypress.env('email'))
      cy.get('#password').clear().type(Cypress.env('password') + 3)
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_IncorrectPassword')}`)
    })

    it('Error - Empty email/password', () => {
      // incorrect email
      // cy.get('#loginid').type('')
      cy.get('#password').type(Cypress.env('password'))
      cy.get('.fsS.pt2').click()
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_EmptyEmail')}`)
      // incorrect pw
      cy.get('#loginid').type(Cypress.env('email'))
      cy.get('#password').clear()
      cy.get('#submitbtn').click()
      cy.contains('メールアドレスまたは、パスワードが誤っています')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FAFail_EmptyPassword')}`)
    })

    it('Can login', () => {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      // Log for debugging
      cy.log(`Generated Random Number: ${randomNumber}`);

      cy.get('#loginid').type(Cypress.env('email'))
      cy.get('#password').type(Cypress.env('password'))
      cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FA')}`)
      cy.get('#submitbtn').click()
      cy.contains('二段階認証')
      // cy.get('input#verifyCode').type(randomNumber.toString(), {force: true})
      // cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FA')}`)
      // cy.get('#validBtn').click()
      // cy.contains('口座情報がご確認いただけます')
      // cy.screenshot(`Aurapay/Profile/${getScnshotName('Login_2FA')}`)
      // // cy.contains('#menu-toggle').should('be.visible')
      // cy.get('#menu-toggle').click()
      // // cy.contains('sidelogout').should('be.visible')
      // cy.get('.sidelogout').click()
    })
  })


})
