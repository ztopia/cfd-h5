import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import i18n from './i18n'
import 'amfe-flexible'
import './utils/validate'
import './vant'
import './style/init.scss'
import './style/common.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app")