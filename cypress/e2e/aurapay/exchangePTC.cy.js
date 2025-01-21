// import { getTimestamp } from '../../utils/allUtils';
// import { getScnshotName } from '../../utils/allUtils';
import { scnshotPath } from '../../utils/allUtils';
import { faker } from '@faker-js/faker';

describe('AuraPay exchange PTC', () => {
  const clas = 'Exchange';
  const year = new Date().getFullYear();

  context('Desktop 1280 x 720', () => {
    beforeEach(() => { 
      const randomAmountBtc = faker.number.float({ min: 0.002, max: 0.005, precision: 0.0001 }); //max: 0.01
      const randomAmountBtc2 = faker.number.int({ min: 20000, max: 100000 }); //max: 100000
      const randomAmountEth = faker.number.float({ min: 0.02, max: 0.05, precision: 0.0001 }); //max: 0.28
      const randomAmountEth2 = faker.number.int({ min: 1000, max: 5000 }); //max: 10000
      const randomAmountXrp = faker.number.int({ min: 50, max: 100 }); //max: 1000
      const randomAmountXrp2 = faker.number.int({ min: 100, max: 1000 }); //max: 10000
      const randomAmountUsdt = faker.number.int({ min: 1, max: 50 }); //max: 500
      const randomAmountUsdt2 = faker.number.int({ min: 500, max: 1000 }); //max: 10000

      // Save amount in Cypress environment
      Cypress.env('randomAmountBtc', randomAmountBtc); 
      Cypress.env('randomAmountBtc2', randomAmountBtc2); 
      Cypress.env('randomAmountEth', randomAmountEth); 
      Cypress.env('randomAmountEth2', randomAmountEth2); 
      Cypress.env('randomAmountXrp', randomAmountXrp); 
      Cypress.env('randomAmountXrp2', randomAmountXrp2); 
      Cypress.env('randomAmountUsdt', randomAmountUsdt); 
      Cypress.env('randomAmountUsdt2', randomAmountUsdt2); 

      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      // const amount = faker.number.int({ min: 10, max: 99 });
      cy.wrap(randomNumber).as('randomNumber');
      // cy.wrap(amount).as('amount');

      cy.login(Cypress.env('email'), Cypress.env('password'))
    })

    it('BTC qty exchange', () => {
      // Visit the cryptocurrency exchange page
      cy.visit('/cryptocurrency/point_crypto')      
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty'))

      // Select BTC
      cy.get('#crypto_BTC_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.get('#exrate').should('be.visible')

      // Exceed balance (Enter an amount that's too high)
      cy.get('input[name="row/amount"]').type('100000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty', 'ExceedBalance'))

      // Over limit (Enter a value that exceeds the limit)
      cy.get('input[name="row/amount"]').clear().type('100')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('ポイントの残高を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty', 'OverLimit'))

      // Invalid space in input
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty', 'EmptyAmount'))

      // Below limit (Enter a value below the minimum limit)
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty', 'BelowLimit'))

      // End Fail section

      // Min BTC amount
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountBtc'))
      cy.get('label[for="rdoCalAmt"]').click()
      cy.screenshot(scnshotPath(clas, 'Btc_Qty'))

      // Confirm the exchange
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('have.value', 'ご入力内容の確認')
      cy.get('.form-send.ValidBtn input#validBtn').click()
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty'))

      // Verify the 2FA code
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()
      
      // Wait for the exchange to complete and confirm success
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Qty'))

      // Visit the history page
      cy.visit(`/history#historybox-${year}`)
      cy.contains('利用履歴').should('be.visible')
      
      // Open the transaction history details
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Btc_Qty'))
    })

    it('BTC point exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point'))

      // Select BTC
      cy.get('#crypto_BTC_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.get('#exrate').should('not.have.value', '')

      // Exceed balance (Enter an amount that's too high)
      cy.get('input[name="row/amount"]').type('20000000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point', 'ExceedBalance'))

      // Over limit (Enter a value that exceeds the limit)
      cy.get('input[name="row/amount"]').clear().type('1000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point', 'OverLimit'))

      // Invalid space in input
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point', 'EmptyAmount'))

      // Below limit (Enter a value below the minimum limit)
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point', 'BelowLimit'))

      // End Fail section

      // Min BTC amount
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountBtc2'))
      cy.get('label[for="rdoCalPt"]').click()
      cy.screenshot(scnshotPath(clas, 'Btc_Point'))

      // Confirm the exchange
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('have.value', 'ご入力内容の確認')
      cy.get('.form-send.ValidBtn input#validBtn').click()
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point'))

      // Verify the 2FA code
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()
      
      // Wait for the exchange to complete and confirm success
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Btc_Point'))

      // Visit the history page
      cy.visit(`/history#historybox-${year}`)
      cy.contains('利用履歴').should('be.visible')
      
      // Open the transaction history details
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Btc_Point'))
    })

    it('ETH qty exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty'))

      cy.get('#crypto_ETH_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      
      // Check if exchange rate exists
      cy.get('#exrate').should('be.visible')
      
      // Exceed balance
      cy.get('input[name="row/amount"]').type('100000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'ExceedBalance'))
      
      // Over limit
      cy.get('input[name="row/amount"]').clear().type('100')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'OverLimit'))
      
      // Spacing
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'Space'))
      
      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'EmptyAmount'))
      
      // Below limit
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('換算後の最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'BelowLimit'))
      
      // Success (Valid case)
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountEth'))
      cy.get('label[for="rdoCalAmt"]').click()
      cy.screenshot(scnshotPath(clas, 'Eth_Qty'))
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('be.visible')
      cy.get('.form-send.ValidBtn input#validBtn').click()
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'Confirm'))
      
      // Verify Code
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()
      
      // Completion
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'Complete'))
      
      // History
      cy.visit('/history#historybox-' + new Date().getFullYear())
      cy.contains('利用履歴').should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Eth_Qty', 'History'))
    })

    it('ETH point exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Qty'))

      cy.get('#crypto_ETH_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      
      // Check if exchange rate exists
      cy.get('#exrate').should('be.visible')
      
      // Exceed balance
      cy.get('input[name="row/amount"]').type('200000000000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'ExceedBalance'))

      // Over limit
      cy.get('input[name="row/amount"]').clear().type('1000000')
      cy.get('label[for="rdoCalPt"]').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'OverLimit'))

      // Spacing
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'EmptyAmount'))

      // Below limit
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'BelowLimit'))

      // Valid case
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountEth2')) // Replace with valid amount
      cy.get('label[for="rdoCalPt"]').click()
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'Valid_Input'))
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('be.visible')
      cy.get('.form-send.ValidBtn input#validBtn').click()
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'Confirm'))

      // Verify Code & Submit
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()

      // Completion
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'Complete'))

      // History
      cy.visit(`/history#historybox-${year}`)
      cy.contains('利用履歴').should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Eth_Point', 'History'))
    })

    it('XRP qty exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty'))

      cy.get('#crypto_XRP_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      
      // Check if exchange rate exists
      cy.get('#exrate').should('be.visible')
      
      // Exceed balance
      cy.get('input[name="row/amount"]').type('1000000000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'ExceedBalance'))

      // Over limit
      cy.get('input[name="row/amount"]').clear().type('10000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'OverLimit'))

      // Spacing
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'EmptyAmount'))

      // Below limit
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('換算後の最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'BelowLimit'))

      // Valid amount
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountXrp')) // Replace with valid amount
      cy.get('label[for="rdoCalAmt"]').click()
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'ValidAmount'))
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('have.value', 'ご入力内容の確認')
      cy.get('.form-send.ValidBtn input#validBtn').click()

      // Confirm exchange
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'Confirmation'))
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      // cy.get('#verifyCode').type(getGaCode(loginEmail))
      cy.get('#ValidBtn').click()

      // Verify completion
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'Completed'))

      // Check history
      cy.visit(`/history#historybox-${year}`)
      cy.contains('利用履歴').should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'History'))
    })

    it('XRP point exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point'))

      cy.get('#crypto_XRP_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      
      // Check if exchange rate exists
      cy.get('#exrate').should('be.visible')
      
      // Exceed balance
      cy.get('input[name="row/amount"]').type('200000000000000')
      cy.get('label[for="rdoCalPt"]').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.contains('ポイントの残高を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'ExceedBalance'))

      // Over limit
      cy.get('input[name="row/amount"]').clear().type('1000000')
      cy.get('label[for="rdoCalPt"]').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'OverLimit'))

      // Spacing
      cy.get('input[name="row/amount"]').clear().type(' ')
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'EmptyAmount'))

      // Below limit
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'BelowLimit'))

      // Valid amount
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountXrp2')) // Replace with valid amount
      cy.get('label[for="rdoCalPt"]').click()
      cy.screenshot(scnshotPath(clas, 'Xrp_Qty', 'ValidAmount'))
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('have.value', 'ご入力内容の確認')
      cy.get('.form-send.ValidBtn input#validBtn').click()

      // Confirm exchange
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'Confirmation'))
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()

      // Verify completion
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'Completed'))

      // Check history
      cy.visit(`/history#historybox-${year}`)
      cy.contains('利用履歴').should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Xrp_Point', 'History'))
    })

    it('USDT qty exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty'))

      cy.get('#crypto_USDT_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalAmt"]').click()
      
      // Check if exchange rate exists
      cy.get('#exrate').should('be.visible')
      
      // Exceed balance
      cy.get('input[name="row/amount"]').type('1000000000000')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'ExceedBalance'))

      // Over limit
      cy.get('input[name="row/amount"]').clear().type('10000')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.get('label[for="rdoCalAmt"]').click()      
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'OverLimit'))

      // Spacing
      cy.get('input[name="row/amount"]').clear().type(' ')      
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalAmt"]').click()
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'EmptyAmount'))

      // Below limit
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('label[for="rdoCalAmt"]').click()      
      cy.contains('換算後の最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'BelowLimit'))

      // Valid amount
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountUsdt')) // Replace with valid amount
      cy.get('label[for="rdoCalAmt"]').click()
      cy.screenshot(scnshotPath('ExchangePTC', 'Usdt_Qty', 'ValidAmount'))
      // cy.contains('仮想通貨へ交換').should('be.visible')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('have.value', 'ご入力内容の確認')
      cy.get('.form-send.ValidBtn input#validBtn').click()

      // Confirm exchange      
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'Confirmation'))
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()

      // Verify completion      
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'Completed'))

      // Check history
      cy.visit(`/history#historybox-${year}`)      
      cy.contains('利用履歴').should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Usdt_Qty', 'History'))
    })

    it('USDT point exchange', () => {
      // Visit the exchange page
      cy.visit('/cryptocurrency/point_crypto')
      cy.contains('仮想通貨へ交換').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point'))

      cy.get('#crypto_USDT_selected').click()
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      
      // Check if exchange rate exists
      cy.get('#exrate').should('be.visible')
      
      // Exceed balance
      cy.get('input[name="row/amount"]').type('200000000000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()
      cy.contains('ポイントの残高を超えています').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'ExceedBalance'))

      // Over limit
      cy.get('input[name="row/amount"]').clear().type('1000000')
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('label[for="rdoCalPt"]').click()      
      cy.contains('1回のポイント交換限度数を超えています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'OverLimit'))

      // Spacing
      cy.get('input[name="row/amount"]').clear().type(' ')  
      cy.contains('有効な数字を入力してください。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'Space'))

      // Empty amount
      cy.get('input[name="row/amount"]').clear()
      cy.get('label[for="rdoCalPt"]').click()      
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'EmptyAmount'))

      // Below limit
      cy.get('input[name="row/amount"]').clear().type('0.00001')
      cy.get('label[for="rdoCalPt"]').click()      
      cy.contains('最小取引限度を下回っています。').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'BelowLimit'))

      // Valid amount
      cy.get('input[name="row/amount"]').clear().type(Cypress.env('randomAmountUsdt2')) // Replace with valid amount
      cy.get('label[for="rdoCalPt"]').click()
      cy.screenshot(scnshotPath('ExchangePTC', 'Usdt_Point', 'ValidAmount'))
      cy.get('#LoadingCommon03').should('not.exist')
      cy.get('.form-send.ValidBtn input#validBtn').should('have.value', 'ご入力内容の確認')
      cy.get('.form-send.ValidBtn input#validBtn').click()

      // Confirm exchange      
      cy.contains('ポイント交換の確認').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'Confirmation'))
      cy.get('@randomNumber').then((randomNumber) => {
        cy.get('input[name="verifyCode"]').clear().type(randomNumber)
        cy.log(`randomNumber: ${randomNumber}`)
      })
      cy.get('#ValidBtn').click()

      // Verify completion      
      cy.contains('交換完了').should('be.visible')
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'Completed'))

      // Check history
      cy.visit(`/history#historybox-${year}`)      
      cy.contains('利用履歴').should('be.visible')
      cy.get('.ToggleCommon04 > div > a').first().click()
      cy.screenshot(scnshotPath(clas, 'Usdt_Point', 'History'))
    })







  })
})
