import http from '../http/http'
import i18n from '../i18n'
/* 封装极验验证公共方法
 **obj需含有两属性
 *{containerId//添加按钮的ID
 *nextHandle//下一步操作
 *}
 */
export class myGeetest {
  constructor(obj) {
    this.settings = obj
  }

  geetestValidate(captchaObj) {
    const that = this
    let { lang } = window.localStorage
    lang === 'zh_CN' ? lang : (lang = 'en')
    http.get(`/users/gee/init_env?t=${new Date().getTime()}`).then(res => {
      const { data } = res
      ;(that.reqId = data.reqId),
        initGeetest(
          {
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: true,
            product: 'bind',
            lang
          },
          that.handler
        )
    })
  }

  // 一次验证
  handler = captchaObj => {
    const that = this
    captchaObj
      .onReady(() => {
        // your code
      })
      .onSuccess(() => {
        // your code
        const result = captchaObj.getValidate()
        // console.log(result);
        that.geetestValidateAgain(result)
      })
      .onError(() => {
        captchaObj.reset() // 调用该接口进行重置
      })

    document.getElementById(that.settings.containerId).addEventListener('click', () => {
      console.log('login-form-btn')
      captchaObj.verify()
    })
  }

  // 极验二次验证
  geetestValidateAgain(result) {
    const that = this
    const parmars = {
      geetest_challenge: result.geetest_challenge,
      geetest_validate: result.geetest_validate,
      geetest_seccode: result.geetest_seccode,
      reqId: this.reqId
    }
    // http.post('/users/gee/validate', parmars).then((res) => {
    //   const { data } = res;
    //   if (data && data.status == 'success') {
    that.settings.nextHandle(parmars)
    //   }
    // });
  }
}
/**
 *全局唯一uuid
 */
export const uuid = () => {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  return s.join('')
}

// 区号
export const getAreaCode = () => {
  return [
    { text: i18n.t("ChinaCode"), value: "+86" },
    { text: i18n.t("HongKongCode"), value: "+852" },
    { text: i18n.t("Macao"), value: "+853" },
    { text: i18n.t("Taiwan"), value: "+886" },
    { text: i18n.t("Korea"), value: "+82" },
    { text: i18n.t("Japan"), value: "+81" },
    { text: i18n.t("American"), value: "+1" },
    { text: i18n.t("Canada"), value: "+1" },
    { text: i18n.t("England"), value: "+44" },
    { text: i18n.t("Singapore"), value: "+65" },
    { text: i18n.t("Malaysia"), value: "+60" },
    { text: i18n.t("Thailand"), value: "+66" },
    { text: i18n.t("Vietnam"), value: "+84" },
    { text: i18n.t("ThePhilippines"), value: "+63" },
    { text: i18n.t("Indonesia"), value: "+62" },
    { text: i18n.t("Italy"), value: "+39" },
    { text: i18n.t("Russia"), value: "+7" },
    { text: i18n.t("NewZealand"), value: "+64" },
    { text: i18n.t("Netherlands"), value: "+31" },
    { text: i18n.t("Sweden"), value: "+46" },
    { text: i18n.t("Australia"), value: "+61" },
    { text: i18n.t("Ukraine"), value: "+380" },
    { text: i18n.t("France"), value: "+33" },
    { text: i18n.t("Afghanistan"), value: "+93" },
    { text: i18n.t("Argentina"), value: "+54" },
    { text: i18n.t("Austria"), value: "+43" },
    { text: i18n.t("Bangladesh"), value: "+880" },
    { text: i18n.t("Bhutan"), value: "+975" },
    { text: i18n.t("Brazil"), value: "+55" },
    { text: i18n.t("CentralAfrica"), value: "+236" },
    { text: i18n.t("Colombia"), value: "+57" },
    { text: i18n.t("Cuba"), value: "+53" },
    { text: i18n.t("Egypt"), value: "+20" },
    { text: i18n.t("Finland"), value: "+358" },
    { text: i18n.t("Hawaii"), value: "+1808" },
    { text: i18n.t("Iran"), value: "+98" },
    { text: i18n.t("Iraq"), value: "+964" },
    { text: i18n.t("Ireland"), value: "+353" },
    { text: i18n.t("Israel"), value: "+972" },
    { text: i18n.t("Jamaica"), value: "+1876" },
    { text: i18n.t("Jordan"), value: "+962" },
    { text: i18n.t("Kuwait"), value: "+965" },
    { text: i18n.t("Laos"), value: "+856" },
    { text: i18n.t("Kyrgyzstan"), value: "+996" },
    { text: i18n.t("Maldive"), value: "+960" },
    { text: i18n.t("Mexico"), value: "+52" },
    { text: i18n.t("Monaco"), value: "+377" },
    { text: i18n.t("Myanmar"), value: "+95" },
    { text: i18n.t("Nepal"), value: "+977" },
    { text: i18n.t("Panama"), value: "+507" },
    { text: i18n.t("Peru"), value: "+51" },
    { text: i18n.t("Pakistan"), value: "+92" },
    { text: i18n.t("Switzerland"), value: "+41" },
    { text: i18n.t("Turkey"), value: "+90" },
    { text: i18n.t("Germany"), value: "+49" },
    { text: i18n.t("India"), value: "+91" },
    { text: i18n.t("AE"), value: "+971" },
  ]
}

// 语言列表
export const localeList = [
  { name: '简体中文', value: 'zh_CN' },
  { name: '繁体中文', value: 'zh_TW' },
  { name: 'English', value: 'en_US' }
]
