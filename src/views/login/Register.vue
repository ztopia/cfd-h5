<template>
  <div class="register">
    <div class="header flex-row">
      <div class="logo">
        <img src="../../assets/login/logo.png" alt="">
      </div>
      <div class="download" @click="$router.push('/download')">下载APP</div>
    </div>
    <img src="https://liteex-pro.oss-cn-hongkong.aliyuncs.com/picture/register_bg.png" alt="bg">
    <div class="register-box" v-if="!registerSuccess">
      <van-tabs
        v-model="businessType"
        :border="false"
        color="#5A59DE"
        line-width="56px"
        title-active-color="#12141A"
        title-inactive-color="#B6B6B6"
      >
        <van-tab :title="$t('PhoneRegister')" name="registerPhone"></van-tab>
        <van-tab :title="$t('EmailRegister')" name="registerEmail"></van-tab>
      </van-tabs>
      <ValidationObserver ref="form">
        <div class="code-warp flex-row" v-if="businessType === 'registerPhone'">
          <div class="field-warp code-picker">
            <van-field
              v-model="areaCode"
              label-width="0"
              readonly
              clickable
              @click="showPicker = true"
            >
              <div slot="button" class="flex-row">
                <van-icon name="arrow-down" />
              </div>
            </van-field>
          </div>
          <div class="field-warp">
            <ValidationProvider :name="$t('Phone')" rules="required|phone" v-slot="{ errors }">
              <van-field
                v-model="phone"
                label-width="0"
                :placeholder="$t('Phone')"
                :error-message="errors[0]"
                @blur="validateUser('check')"
              >
              </van-field>
            </ValidationProvider>
          </div>
        </div>
        <div class="field-warp" v-else>
          <ValidationProvider :name="$t('Email')" rules="required|email" v-slot="{ errors }">
            <van-field
              v-model="email"
              label-width="38px"
              :placeholder="$t('EmailAddress')"
              :error-message="errors[0]"
              @blur="validateUser('check')"
            >
              <div slot="left-icon" class="left-icon"></div>
            </van-field>
          </ValidationProvider>
        </div>
        <div class="field-warp">
          <ValidationProvider :name="$t('Code')" rules="required|code" v-slot="{ errors }">
            <van-field
              v-model="validCode"
              label-width="0"
              :placeholder="$t('Code')"
              :error-message="errors[0]"
            >
              <div slot="button" class="get-code" @click="validateUser('code')" v-if="!sending">{{$t('SendCode')}}</div>
              <div slot="button" class="get-code" v-else>{{totalTime}}s</div>
            </van-field>
          </ValidationProvider>
        </div>
        <div class="field-warp">
          <ValidationProvider :name="$t('Password')" rules="required|password" vid="password" v-slot="{ errors }">
            <van-field
              v-model="password"
              type="password"
              label-width="0"
              :placeholder="$t('Password')"
              :error-message="errors[0]"
            >
            </van-field>
          </ValidationProvider>
        </div>
        <div class="field-warp">
          <ValidationProvider :name="$t('Password')" rules="confirmed:password" v-slot="{ errors }">
            <van-field
              v-model="pwdCfm"
              type="password"
              label-width="0"
              :placeholder="$t('ConfirmPassword')"
              :error-message="errors[0]"
            >
            </van-field>
          </ValidationProvider>
        </div>
      </ValidationObserver>
      <div class="service-warp flex-row">
        <van-checkbox v-model="checked" shape="square" checked-color="#5A59DE">
          <span class="service-text">
            已阅读并同意
          </span>
        </van-checkbox>
        <a class="service-link" href="https://liteex.zendesk.com/hc/zh-cn/articles/900000558626" target="_blank">LiteEx网络服务条款</a>
      </div>
      <div class="register-btn" :class="[canClick ? 'active' : '']" @click="onRegister">
        {{$t('Register')}}
      </div>
    </div>
    <div class="register-box" v-else>
      <div class="success-warp">
        <img src="../../assets/login/success.png" alt="success">
      </div>
      <article class="success-text">注册成功</article>
      <article class="welcome-text">欢迎使用LiteEX</article>
      <p class="enter-text">点击下方按钮下载APP,开启你的交易之旅</p>
      <div class="enter-warp">
        <img src="../../assets/login/enter.png" alt="enter">
      </div>
      <div class="register-btn active" @click="$router.push('/download')">
        下载APP
      </div>
    </div>
    <div class="gee-btn" id="codeBtn" ref="codeBtn"></div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="areaCodeList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import md5 from 'md5'
import { checkAccount, getVerifyCodeBeforeAuth, register } from '../../http/login'
import { getAreaCode, myGeetest } from '../../utils/common'
import { validate } from 'vee-validate'
export default {
  data() {
    return {
      businessType: 'registerPhone',
      inviteCode: '',
      phone: '',
      email: '',
      validCode: '',
      password: '',
      pwdCfm: '',
      checked: true,
      login_pass_grade: 1,
      userChannel: 'h5_register',
      areaCode: getAreaCode()[0].value,
      areaCodeList: getAreaCode(),
      showPicker: false,
      totalTime: 60, // 验证码发送间隔
      sending: false, // 是否正在发送验证码
      registerSuccess: false,
      isSubmitting: false
    }
  },
  computed: {
    canClick() {
      return (this.phone || this.email)
        && this.password
        && this.pwdCfm
        && this.validCode
    }
  },
  watch: {
    businessType() {
      this.phone = ''
      this.email = ''
      this.validCode = ''
      this.password = ''
      this.pwdCfm = ''
      this.$refs.form.reset()
    }
  },
  created() {
    new myGeetest({
      containerId: 'codeBtn',
      nextHandle: this.getCode,
      form: true
    }).geetestValidate()
    if (this.$route.query.inviteCode) {
      this.inviteCode = this.$route.query.inviteCode
    }
  },
  methods: {
    onConfirm(item) {
      this.areaCode = item.value
      this.showPicker = false
    },
    validateUser(type) {
      if (this.businessType === 'registerPhone') {
        validate(this.phone, 'required|phone').then(result => {
          if (!result.valid) return false
          this.checkUser(type)
        })
      } else {
        validate(this.email, 'required|email').then(result => {
          if (!result.valid) return false
          this.checkUser(type)
        })
      }
    },
    checkUser(type) {
      const params = {
        username: this.businessType === 'registerPhone' ? this.phone : this.email
      }
      checkAccount(params).then(res => {
        if (res.data.code === 0) {
          this.$toast(this.$t('HadRegis'))
        } else if (res.data.code === 102020729) {
          if (type === 'code') {
            this.$refs.codeBtn.click()
          }
        }
      })
    },
    getCode(geeParams) {
      let params = {
        businessType: this.businessType,
        receiver: this.businessType === 'registerPhone' ? this.phone : this.email,
        ...geeParams
      }
      if (this.businessType === 'registerPhone') {
        params.areaCode = this.areaCode
      }
      getVerifyCodeBeforeAuth(params).then(res => {
        if (res.data.code === 0) {
          this.$toast(this.$t('SendSuccess'))
          this.sending = true
          this.countDown()
        }
      })
    },
    countDown() {
      setTimeout(() => {
        this.totalTime--
        if (this.totalTime > 0) {
          this.countDown()
        } else {
          this.sending = false
          this.totalTime = 60
        }
      }, 1000)
    },
    onRegister() {
      if (!this.canClick) return false
      if (this.isSubmitting) return false
      this.$refs.form.validate().then(success => {
        if (!success) return false
        this.isSubmitting = true
        let params = {
          password: md5(this.password),
          validCode: this.validCode,
          inviteCode: this.inviteCode,
          businessType: this.businessType,
          login_pass_grade: this.login_pass_grade,
          userChannel: this.userChannel
        }
        if (this.businessType === 'registerPhone') {
          params.areaCode = this.areaCode
          params.phone = this.phone
        } else {
          params.email = this.email
        }
        register(params).then(res => {
          this.isSubmitting = false
          if (res.data.code === 0) {
            this.registerSuccess = true
          }
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
