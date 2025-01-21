// import { getTimestamp } from '../../utils/allUtils';
// import { getScnshotName } from '../../utils/allUtils';
import { scnshotPath } from '../../utils/allUtils';
import { faker } from '@faker-js/faker';

describe('AuraPay exchange PTF', () => {
  const clas = 'Exchange';
  const year = new Date().getFullYear();

  context('Desktop 1280 x 720', () => {
    beforeEach(() => { 
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const amount = faker.number.int({ min: 10, max: 99 });
      cy.wrap(randomNumber).as('randomNumber');
      cy.wrap(amount).as('amount');

      cy.login(Cypress.env('email'), Cypress.env('password'))
    })

    it('JPY amount exchange', () => {
      cy.visit('/account_transfer/point_fiat')
      cy.contains('法定通貨へ交換').should('be.visible')

      // Select JPY transfer option
      cy.get('#Transfer_jpy').click()
      cy.get('label[for="rdoCalAmt"]').click()
      // check if have exchange rate
      cy.get('#exrate').should('be.visible')

      // Invalid number: Zero
      cy.get('input[name="row/amount"]').clear().type('0')
      cy.contains('1 以上の値を入力してください').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'InvalidAmount'))

      // Invalid number: Decimal below 1
      cy.get('input[name="row/amount"]').clear().type('0.1')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'InvalidAmount'))

      // Empty input
      cy.get('input[name="row/amount"]').clear()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'EmptyAmount'))

      // Space as input
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'SpaceAmount'))

      // Exceed maximum amount
      cy.get('input[name="row/amount"]').clear().type('10000000000000000')
      cy.get('#rateAmount').click({force: true})
      cy.contains('ポイントの残高を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'ExceedBalance'))

      // Valid input
      cy.get('@amount').then((amount) => {
        cy.get('input[name="row/amount"]').clear().type(amount);
        cy.log(`Amount: ${amount}`);
      });
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'Valid'))

      // Proceed with the valid input
      cy.get('label[for="rdoCalAmt"]').click()
      cy.get('#validBtn').click()

      // Verify confirmation page
      cy.contains('法定通貨交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'Confirmation'))

      // Input verification code (mock the method for GA code or use actual test data)
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('#verifyCode').clear().type(randomNumber);
        cy.log(`randomNumber: ${randomNumber}`);
      });
      cy.get('#validBtn').click()

      // Verify success page
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'Completed'))
    })

    it('Validates transaction history', () => {
      // Visit history page
      cy.visit(`/history#historybox-' + ${year}`)
      // Check for the current year
      cy.contains(`${year}年`).should('be.visible')
      // Expand history and take a screenshot
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Amount', 'History'))
    })

    it('JPY point exchange', () => {
      // Visit the exchange page
      cy.visit('/account_transfer/point_fiat')
      cy.contains('法定通貨へ交換').should('be.visible');

      // Select JPY transfer option
      cy.get('#Transfer_jpy').click()
      cy.get('label[for="rdoCalPt"]').click()
      // check if have exchange rate
      cy.get('#exrate').should('be.visible')

      // Invalid number: Zero
      cy.get('input[name="row/amount"]').clear().type('0')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('1 以上の値を入力してください').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'InvalidAmount'))

      // Invalid number: Decimal below 1
      cy.get('input[name="row/amount"]').clear().type('0.1')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'InvalidDecimal'))

      // Empty input
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'EmptyAmount'))

      // Space as input
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'SpaceAmount'))

      // Exceeding maximum points
      cy.get('input[name="row/amount"]').clear().type('10000000000000000000')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('ポイントの残高を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'ExceedBalance'))

      // Valid input
      cy.get('@amount').then((amount) => {
        cy.get('input[name="row/amount"]').clear().type(amount);
        cy.log(`Amount: ${amount}`);
      });
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'ValidAmount'))

      // Proceed with valid input
      cy.get('#validBtn').click()

      // Confirm exchange page
      cy.contains('法定通貨交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'Confirmation'))

      // Enter verification code (replace with actual code logic)
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('#verifyCode').clear().type(randomNumber);
        cy.log(`randomNumber: ${randomNumber}`);
      });
      cy.get('#validBtn').click()

      // Verify completion page
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'Completed'))
    })

    it('Validates transaction history', () => {
      // Visit history page
      cy.visit(`/history#historybox-${year}`)
      // Assert the presence of the current year in the history
      cy.contains(`${year}年`).should('be.visible')
      // Expand history and take a screenshot
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'PTF_Jpy_Point', 'History'))
    });






  })
})
