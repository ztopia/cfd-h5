import dayjs from 'dayjs'
const Big = require('big.js')

// 时间格式化
export const dateFormat = (value, type = 'HH:mm MM/DD') => {
  if (!value) return ''
  value = dayjs(value).format(type)
  return value
}

// 时间格式化（日期）
export const dateFormatForDate = (value, type = 'MM/DD') => {
  if (!value) return ''
  value = dayjs(value).format(type)
  return value
}

// 将小数变成百分比
export const toRateFilter = value => {
  if (!value) return '0%'
  return new Big(value).times(new Big(100)).round(2).toString() + '%'
}

// 截取用户id作为头像
export const idToAvatarText = value => {
  if (!value) return value
  const valueStr = value.toString()
  if (valueStr.length > 2) {
    return valueStr.substring(0, 2)
  } else {
    return valueStr
  }
}

// 截取用户id作为头像
export const idToAvatar = value => {
  if (!value) return value
  return value % 83
}

// 数量格式化为最多6位小数
export const toRound6 = value => {
  if (!value) return 0
  return Number(new Big(value).round(6, 0).toString())
}
