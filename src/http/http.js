/**
 * http配置
 */

import axios from 'axios'
import router from '../router'
import store from '../store'
import i18n from '../i18n'
import noTokenUrl from './noTokenUrl'
import { Notify } from 'vant'
// axios 配置
axios.defaults.timeout = 10000
axios.defaults.baseURL = process.env.VUE_APP_BASE_API

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    const apiUrl = config.url
    if (noTokenUrl.indexOf(apiUrl) > -1) return config
    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err),
)
// http response 拦截器
const filterArr = [0, 1, 2, 3, 1031, 1041, 1042, 102190708, 102110705, 102020729, 102190725]
/**
* 1,2,3资产用来判断状态
* 1031 下单用到
* 1041 撮合未就绪，不显示
* 102190725 获取提现参数失败
*/
axios.interceptors.response.use(
  (response) => {
    const resData = response.data
    if (resData.hasOwnProperty('code')) {
      const index = filterArr.findIndex(item => item === resData.code)
      if (index > -1) return response
      const msgObj = i18n.t('ResCode')
      let resMsg = ''
      if (resData.code) {
        Object.keys(msgObj).forEach((key) => {
          if (Number(key) === resData.code) {
            resMsg = msgObj[key]
            Notify(resMsg)
          }
        })
      }
    }
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        store.commit('isLogin', false) // 出现401 设置游客模式，相应的，登陆后取消游客模式
        // const { config } = error
        // const refreshToken = localStorage.getItem('refresh_token')
        // if (!refreshToken) {
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
          router.replace('/login')
          return Promise.reject(error.response.data)
        // }
        // if (config.isRetryRequest) return Promise.reject(error.response.data)
        // axios.get(`/user/refresh?refreshToken=${refreshToken}`).then((res) => {
        //   config.isRetryRequest = true
        //   if (!res) {
        //     localStorage.removeItem('refresh_token')
        //     return axios(config)
        //   }
        //   if (res.data.code === 0) {
        //     localStorage.setItem('token', res.data.data.access_token)
        //     localStorage.setItem('refresh_token', res.data.data.refresh_token)
        //     store.commit('isLogin', true)
        //     window.location.reload()
        //   } else {
        //     localStorage.removeItem('refresh_token')
        //   }
        //   return axios(config)
        // })
      }
    }
    return Promise.reject(error.response.data)
  },
)

export default axios
