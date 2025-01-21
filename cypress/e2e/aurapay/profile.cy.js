import { getTimestamp } from '../../utils/allUtils';
import { getScnshotName } from '../../utils/allUtils';
import { faker } from '@faker-js/faker';

describe('AuraPay update profile', () => {

  // const getScnshotName = (baseName = 'Default') => {
  //   const timestamp = new Date()
  //     .toISOString()
  //     .replace(/T/, '_')
  //     .replace(/\..+/, '')
  //     .replace(/[-:]/g, '')
  //     .slice(2);
  //   return `${timestamp}_${baseName}`;
  // };

  context('Desktop 1280 x 720', () => {
    beforeEach(() => {
      cy.login(Cypress.env('email'), Cypress.env('password'))
      // cy.preserveSession();
      // Get and log all cookies
      // cy.getCookies().then((cookies) => {
      //   cy.log('Cookies:', cookies);

      //   // Print cookies to the browser console for inspection
      //   cookies.forEach((cookie) => {
      //     cy.log(`Cookie Name: ${cookie.name}`);
      //   });
      // });
    })

    it('Edit password', () => {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);

      cy.visit('/configuration')
      cy.contains('口座情報').should('be.visible')
      cy.get('#tab-activity-main #pills-si-tab').click()
      cy.contains('ログインパスワード').should('be.visible')
      cy.get('#pills-si #content-tab-box .content-tab-wi:nth-child(2) .btn').click()
      cy.contains('ログインパスワードの変更').should('be.visible')
      // invalid length
      cy.get('input[name="row/password0"]').type(Cypress.env('password'))
      cy.get('input[name="row/password1"]').type('123123')
      cy.contains('8 文字以上を入力してください').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfileFail_Password_InvalidLength')}`)
      // invalid passowrd/characters
      // invalid characters - todo
      // invalid confirm pass
      cy.get('input[name="row/password1"]').clear().type(Cypress.env('password'))
      cy.get('input[name="row/password2"]').clear().type(Cypress.env('password') + '123123')
      cy.contains('パスワードを確認してください').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfileFail_Password_InvalidConfirmPassword')}`)
      // incorrect current pass
      cy.get('input[name="row/password0"]').clear().type('123123')
      cy.get('input[name="row/password1"]').clear().type(Cypress.env('password'))
      cy.get('input[name="row/password2"]').clear().type(Cypress.env('password'))
      cy.get('#validBtn').click()
      cy.contains('現在のログインパスワードが間違っています。').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfileFail_Password_IncorrectCurrentPassword')}`)
      cy.get('input[name="row/password0"]').clear().type(Cypress.env('password'))
      cy.get('input[name="row/password1"]').clear().type(Cypress.env('password'))
      cy.get('input[name="row/password2"]').clear().type(Cypress.env('password'))
      cy.get('#validBtn').click()
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Password')}`)
      cy.contains('変更する').should('be.visible')
      cy.get('.pass-eye').click()
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Password')}`)
      cy.get('button#nextBtn').click()

      // Check if the text "2段階認証" exists
      cy.contains('ログインパスワードの変更完了').then(($element) => {
        if (!$element.length) {
          // Text x exists, perform the action
          cy.contains('2段階認証').should('be.visible')
          cy.get('input[name="_verify_code"]').type(randomNumber.toString())
          cy.get('#2FANextBtn').click()
        }
      });
      cy.contains('ログインパスワードの変更完了').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Password')}`)
      // cy.get('.container2 button').click()
      // cy.contains('口座情報').should('be.visible')
    })

    it('Edit language', () => {
      const languages = ['ja', 'en', 'cn'];
      const randomIndex = Math.floor(Math.random() * languages.length);
      const randomLang = languages[randomIndex];
      cy.log(`Generated Random Lang: ${randomLang}`);

// login(Cypress.env('email'))
      cy.visit('/configuration')
      cy.contains('口座情報').should('be.visible')
      cy.get('#content-tab-box div:nth-child(2) .info-btn button').click()
      cy.contains('受信メールの言語の変更').should('be.visible')
      // empty lang
      cy.get('select[name="user/email_lang"]').select('')
      cy.contains('必須項目です').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_LanguageFail_Empty')}`)
      cy.get('select[name="user/email_lang"]').select(randomLang)
      cy.get('p.error').click()
      cy.get('#validBtn').click()
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Language')}`)
      cy.contains('変更する受信メールの言語をご確認ください。').should('be.visible')
      cy.get('#nextBtn').click()
      cy.contains('受信メールの言語の変更完了').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Language')}`)
      cy.get('.btn-success').click()
      cy.visit('configuration?tab=0#content-tab-box')
      cy.contains('メール受信設定').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Language')}`)
    })

    it('Edit secret ques', () => {
      const languages = ['ja', 'en', 'cn'];
      const randomIndex = Math.floor(Math.random() * languages.length);
      const randomLang = languages[randomIndex];

      cy.visit('/configuration')
      cy.contains('口座情報')
      cy.get('#tab-activity-main #pills-si-tab').click()
      cy.contains('秘密の質問')
      cy.get('#info_box_si .content-tab-wi.column-reverse .btn').click()
      cy.contains('秘密の質問の変更')
      // incorrect answer
      cy.get('input[name="row/old_answer"]').type('L')
      cy.get('select[name="row/secret_question"]').select('母親の旧姓は？')
      cy.get('input[name="row/secret_answer"]').type('secret_answer')
      cy.get('#validBtn').click()
      cy.contains('秘密の質問の答えが間違っています。')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_SecretQuesFail_IncorrectAns')}`)
      // end fail
      cy.get('input[name="row/old_answer"]').clear().type('secret_answer')
      cy.get('select[name="row/secret_question"]').select('母親の旧姓は？')
      cy.get('input[name="row/secret_answer"]').clear().type('secret_answer')
      cy.get('#validBtn').click()
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_SecretQues')}`)
      cy.get('#nextBtn').click()
      cy.contains('秘密の質問の変更完了')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_SecretQues')}`)
    })

    it('Edit address', () => {
      // const baseUrl = Cypress.env('baseUrl');
      // const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 15);
      const fakeAddress = {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.number.int({ min: 10000, max: 99999 }), //faker.address.zipCode(),
        country: faker.address.country(),
      };
      cy.log('Fake Address:', JSON.stringify(fakeAddress));

      // Visit configuration
      cy.visit('/configuration')
      cy.contains('口座情報')
      // Click change address button
      cy.get('#content-tab-box1 .content-tab-wi:nth-child(3) button').click();
      cy.contains('変更するご登録情報を入力、選択してください。')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Address')}`)

      // Check if is abroad
      cy.get('#jpy-contents').then(($el) => {
        const isAbroad = $el.css('display') === 'none';

        if (isAbroad) {
          // Fill in abroad address
          cy.log('Abroad')
          cy.get('input[name="row/postal"]').clear()
          cy.get('#others-contents div:nth-child(5) input').clear()
          cy.get('#others-contents div:nth-child(7) input').clear()
          cy.get('#others-contents div:nth-child(9) input').clear()
          cy.contains('必須項目です').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_AddressFail_EmptyAddress')}`)

          cy.get('input[name="row/postal"]').type(fakeAddress.zipCode)
          cy.get('#others-contents div:nth-child(5) input').type(fakeAddress.street)
          cy.get('#others-contents div:nth-child(7) input').type(fakeAddress.city)
          cy.get('#validBtn').click()
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Address')}`)
        } else {
          // Domestic address
          cy.log('日本国内')
          cy.get('input[name="row/postal3"]').clear()
          cy.get('input[name="row/postal4"]').clear()
          cy.get('select[name="row/pref"]').focus().type('{downarrow}'.repeat(5)).type('{enter}')
          cy.get('#addr1').clear()
          cy.get('input[name="row/addr2"]').clear()
          cy.contains('必須項目です').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_AddressFail_EmptyAddress')}`)

          cy.get('input[name="row/postal3"]').type('123')
          cy.get('input[name="row/postal4"]').type('1234')
          cy.get('#addr1').type(fakeAddress.street)
          cy.get('input[name="row/addr2"]').type(fakeAddress.city)
          cy.get('#validBtn').click()
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Address')}`)
        }
      });

      // Check if popup exists
      cy.get('body').then(($body) => {
        if ($body.find('#cboxContent #PopupBusinessAddressChange').length > 0) {
          cy.log('Business Address Change Popup');
          cy.contains('各種法人資料の再提出のお願い').should('be.visible')
          cy.get('#PopupBusinessAddressChange label.clarus-check2').click({force: true})
          cy.get('#PopupBusinessAddressChange_set').click({force: true})
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Address')}`)
        } else {
          cy.log('Phone Change Popup')
          cy.contains('住所証明書の再提出のお願い').should('be.visible')
          cy.get('#PopupPhoneChange label.clarus-check2').click({force: true})
          cy.get('#PopupPhoneChange_set').click({force: true})
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_Address')}`)
        }
      })

      // Final confirmation
      cy.get('#nextBtn').click()
      cy.contains('ご住所の変更完了').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_AddressComplete')}`)

      // Revisit configuration to confirm
      cy.visit(`/configuration?tab=0#info_box_ai`)
      cy.contains('口座情報').should('be.visible')
      cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_AddressFinalCheck')}`)
    })

    it('Edit phone', () => {
      let phoneCode = '+65'; 
      // Generate a unique 8-digit random number
      let phoneNumber = faker.number.int({ min: 10000000, max: 99999999 });
      cy.log('phoneNumber: ', phoneNumber)
      const randomNumber = Math.floor(100000 + Math.random() * 900000);

      // Visit configuration
      cy.visit('/configuration')
      cy.contains('口座情報')
      // Click on the button to change phone
      cy.get('#content-tab-box1 .content-tab-wi:nth-child(4) button').click()
      cy.get('#telpreni').invoke('val').then((currentPhoneCode) => {
        phoneCode = currentPhoneCode;
        cy.log(`currentPhoneCode: ${currentPhoneCode} || phoneCode: ${phoneCode}`)
      })

      // Check account type
      cy.url().then((url) => {
        const isPersonal = url.includes('phone_change')
        cy.log(`isPersonal: ${isPersonal}`)

        if (isPersonal) {
          // Personal account flow
          cy.contains('ご連絡先の追加・変更').should('be.visible')
          // Empty phone
          cy.get('select[name="row/mobile_code"]').select('')
          cy.get('input[name="row/mobile_no"]').clear()
          cy.get('input[name="row/secret_answer"]').click()
          cy.contains('必須項目です').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneFail_EmptyPhone')}`)
          // Empty secret answer
          cy.get('select[name="row/mobile_code"]').select('+65')
          cy.get('input[name="row/mobile_no"]').clear()
          cy.get('input[name="row/secret_answer"]').clear()
          cy.get('input[name="row/secret_answer"]').click()
          cy.contains('必須項目です').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneFail_EmptySecretAns')}`)
          // Incorrect secret answer
          cy.get('select[name="row/mobile_code"]').select('+65')
          cy.get('input[name="row/mobile_no"]').type('12341234')
          cy.get('input[name="row/secret_answer"]').type('s')
          cy.get('#validBtn').click()
          cy.contains('秘密の質問の答えが間違っています。').should('be.visible')

          // 秘密の質問の答えの入力回数が規定数を超えたため、しばらく時間を置いてから再度お試しください。 - todo

          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneFail_IncorrectSecretAns')}`)
          // Duplicate phone number
          cy.get('input[name="row/secret_answer"]').clear().type('secret_answer')
          cy.get('#opt_telmainni').click()
          cy.get('#validBtn').click()
          cy.contains('居住国と異なる国番号の携帯番号はご利用できません').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneFail_IncorrectTelCode')}`)
          // Successful phone change
          cy.get('select[name="row/mobile_code"]').select(phoneCode)
          cy.get('input[name="row/mobile_no"]').clear().type(phoneNumber)
          cy.get('#validBtn').click()
          // check if have text
          cy.contains('SMS確認コード').then(($element) => {
            if ($element.length) {
              // Text exists, perform the action
              cy.get('input[name="auth_code"]').type(randomNumber)
              cy.get('#validBtn').click()
            }
          });
          cy.contains('ご連絡先の変更完了').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneSuccess')}`)
        } else {
          // Business account flow
          cy.contains('代表電話番号・WEBサイトURLの追加・変更').should('be.visible')
          // Empty phone
          cy.get('select[name="row/tel_code"]').select('')
          cy.get('input[name="row/tel_no"]').clear()
          cy.contains('必須項目です').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneFail_EmptyPhone')}`)
          // Successful phone change
          cy.get('select[name="row/tel_code"]').select(phoneCode)
          cy.get('input[name="row/tel_no"]').type(phoneNumber)
          cy.get('#validBtn').click()
          // check if have text
          cy.contains('SMS確認コード').then(($element) => {
            if ($element.length) {
              // Text exists, perform the action
              cy.get('input[name="auth_code"]').type(randomNumber)
              cy.get('#validBtn').click()
            }
          });
          cy.contains('代表電話番号・URLの変更完了').should('be.visible')
          cy.screenshot(`Aurapay/Profile/${getScnshotName('EditProfile_PhoneSuccess')}`)
        }
      })
    })







  })
})
