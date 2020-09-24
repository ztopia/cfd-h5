<template>
  <div class="download-ios">
    <img src="../../assets/download/app_stable_bg.png" class="stable-bg" />
    <img src="../../assets/download/liteex-logo.png" class="logo" />
    <div :class="isClick ? 'btn dis-click' : 'btn'" @click="download">
      {{ isClick ? '正在安装...' : '点击安装' }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isClick: false,
    }
  },
  methods: {
    download() {
      this.isClick = true
      window.location = window.location =
        'itms-services://?action=download-manifest&url=https://liteex-app.oss-cn-heyuan.aliyuncs.com/liteex.plist'
    },
  },
}
</script>

<style lang="scss" scoped>
.download-ios {
  .stable-bg {
    width: 100%;
    display: block;
    position: relative;
  }
  .logo {
    position: absolute;
    width: 72px;
    left: 50%;
    margin-left: -36px;
    top: 99px;
  }
  .btn {
    position: absolute;
    width: 100px;
    height: 28px;
    background: #ffffff;
    border-radius: 5px;
    left: 50%;
    margin-left: -50px;
    top: 213px;
    color: #6236ff;
    font-size: 12px;
    line-height: 28px;
    text-align: center;
  }
  .dis-click {
    background-color: #666;
    color: #fff;
  }
}
</style>
