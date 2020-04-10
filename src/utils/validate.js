// 校验模块
import Vue from 'vue'
import i18n from '../i18n'

// 加载需要使用的验证组件
import { setInteractionMode, ValidationProvider, ValidationObserver, extend } from 'vee-validate'

// 输入框失去焦点校验
setInteractionMode('lazy')

// 加载内置的验证规则
import * as rules from 'vee-validate/dist/rules'

// 注册全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// 自定义校验
// 必填项校验
extend('required', {
  ...rules.required,
  // message: '请输入{_field_}'
  message: (_field_) => i18n.t('PleaseInput', { _field_ })
})
// 用户名校验
extend('username', {
  validate: value => {
    return /(^\d{6,11}$)|(^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$)/.test(value)
  },
  // message: '用户名格式错误'
  message: () => i18n.t('UsernameError')
})
// 手机号校验
extend('phone', {
  validate: value => {
    return /^\d{6,11}$/.test(value)
  },
  // message: '手机号格式错误'
  message: () => i18n.t('PhoneError')
})
// 邮箱校验
extend('email', {
  validate: value => {
    return /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/.test(value)
  },
  // message: '邮箱格式错误'
  message: () => i18n.t('ResCode.102020710')
})
// 验证码校验
extend('code', {
  validate: value => {
    return /^\d{6}$/.test(value)
  },
  // message: '验证码格式错误'
  message: () => i18n.t('CodeError')
})
// 密码校验
extend('password', {
  validate: value => {
    return /^[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、|\w]{8,24}$/.test(value)
  },
  // message: '请输入8-24位密码'
  message: () => i18n.t('InputPassword')
})
// 确认密码校验
extend('confirmed', {
  ...rules.confirmed,
  // message: '两次输入{target}不一致'
  message: (target) => i18n.t('PasswordNotSame', { target })
})
// 最小长度校验
extend('min', {
  ...rules.min,
  // message: '{_field_}至少{length}个字符'
  message: (_field_, { length }) => i18n.t('LeastCharacters', { _field_, length })
})
// 最小值校验
extend('min_value', {
  ...rules.min_value,
  // message: '{_field_}必须大于等于{min}'
  message: (_field_, { min }) => i18n.t('GreaterThan', { _field_, min })
})
// 最小提币数量
extend('minCashNum', {
  validate: value => {
    return value >= 200
  },
  // message: '最小提币数量200'
  message: () => i18n.t('MinDepositNum')
})
