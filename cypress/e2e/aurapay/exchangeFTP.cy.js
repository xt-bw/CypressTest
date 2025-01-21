// import { getTimestamp } from '../../utils/allUtils';
// import { getScnshotName } from '../../utils/allUtils';
import { scnshotPath } from '../../utils/allUtils';
import { faker } from '@faker-js/faker';

describe('AuraPay exchange FTP', () => {
  const clas = 'Exchange';
  const year = new Date().getFullYear();

  context('Desktop 1280 x 720', () => {
    beforeEach(() => { 
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const amount = faker.number.int({ min: 1000, max: 9999 });
      cy.wrap(randomNumber).as('randomNumber');
      cy.wrap(amount).as('amount');
      // run these tests as if in a desktop
      // browser with a 720p monitor
      // cy.viewport(1280, 720) // def 1000x660
      cy.login(Cypress.env('email'), Cypress.env('password'))
    })

    it('JPY amount exchange', () => {
      cy.visit('/account_transfer/fiat_point')
      cy.contains('ポイントへ交換')

      // Click Transfer JPY and perform validation
      cy.get('#Transfer_jpy').click()
      cy.get('label[for="rdoCalAmt"]').click()
      // check if have exchange rate
      cy.get('#exrate').should('be.visible')

      // Check invalid inputs
      cy.get('input[name="row/amount"]').type('0')
      cy.contains('1 以上の値を入力してください').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Amount', 'InvalidAmount'))

      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Amount', 'InvalidAmount'))

      cy.get('input[name="row/amount"]').type('0.1')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Amount', 'InvalidAmount'))

      // Insufficient amount/point
      cy.get('input[name="row/amount"]').clear().type('1000000000000')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('交換元の通貨残高を超えています。').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Amount', 'InvalidAmount'))

      // Valid amount
      cy.get('@amount').then((amount) => {
        cy.get('input[name="row/amount"]').clear().type(amount);
        cy.log(`Amount: ${amount}`);
      });
      // cy.get('input[name="row/amount"]').clear().type(this.amount)
      cy.screenshot(scnshotPath('FTP_Jpy_Amount'))
      cy.get('label[for="rdoCalAmt"]').click()
      cy.get('#validBtn').click()

      // Confirmation
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('#verifyCode').clear().type(randomNumber); //cy.getGaCode()) // Custom command to get GA code
        cy.log(`randomNumber: ${randomNumber}`);
      }); 
      cy.screenshot(scnshotPath('FTP_Jpy_Amount'))
      cy.get('#validBtn').click()

      // Completion 
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Amount'))

      // History verification
      cy.visit(`/history#historybox-${year}`)
      cy.contains(`${year}年`).should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath('FTP_Jpy_Amount'))
    })

    it('JPY point exchange', () => {
      // Visit the exchange page
      cy.visit('/account_transfer/fiat_point')
      cy.contains('ポイントへ交換').should('be.visible')

      // Select JPY transfer option
      cy.get('#Transfer_jpy').click()
      cy.get('label[for="rdoCalPt"]').click()
      // check if have exchange rate
      cy.get('#exrate').should('be.visible')

      // Invalid input cases
      cy.get('input[name="row/amount"]').type('0')
      cy.contains('1 以上の値を入力してください').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'InvalidAmount'))

      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'InvalidAmount'))

      cy.get('input[name="row/amount"]').type('0.1')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'InvalidAmount'))

      // Insufficient balance case
      cy.get('input[name="row/amount"]').clear().type('1000000000000')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('交換元の通貨残高を超えています。').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'InsufficientBalance'))

      // Valid input case
      cy.get('@amount').then((amount) => {
        cy.get('input[name="row/amount"]').clear().type(amount);
        cy.log(`Amount: ${amount}`);
      });
      cy.screenshot(scnshotPath('FTP_Jpy_Point'))
      cy.get('label[for="rdoCalPt"]').click()
      cy.get('#validBtn').click()

      // Confirm exchange
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('#verifyCode').clear().type(randomNumber);
        cy.log(`randomNumber: ${randomNumber}`);
      });
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'ConfirmExchange'))
      cy.get('#validBtn').click()

      // Verify completion
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'ExchangeComplete'))

      // Navigate to history and verify
      cy.visit(`/history#historybox-${year}`)
      cy.contains(`${year}年`).should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath('FTP_Jpy_Point', 'History'))
    })





  })
})
