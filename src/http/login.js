import http from './http'

export const login = params => http.post('/user/login', params) // 登录
export const userInfo = () => http.get('/users/userInfo') // 获取用户信息
export const checkAccount = params => http.get('/users/checkAccount', { params }) // 验证账户是否已注册
export const getVerifyCodeBeforeAuth = params => http.get('/users/getVerifyCodeBeforeAuth', { params }) // 获取验证码（未认证）
export const register = params => http.post('/users/speed/register', params) // 快速注册
export const changePassword = params => http.post('/users/changePassword', params) // 找回密码