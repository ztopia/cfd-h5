<template>
  <div class="main">
    <img src="https://liteex-pro.oss-cn-hongkong.aliyuncs.com/picture/download_bg.png" alt />
    <div class="footer">
      <!-- <a 
        class="btn app-store"
        download="LiteEx"
        href="https://testflight.apple.com/join/Q2XFZWcH"
        v-if="showAppStore"
      >
        <i class="apple-icon">
          <img src="../../assets/download/apple.png" alt />
        </i>
        <article class="store-warp">
          <div class="store-text">App Store</div>
          <div class="apple-id">非大陆Apple ID</div>
        </article>
      </a> -->
      <a
        class="btn local"
        download="LiteEx"
        href="https://testflight.apple.com/join/Q2XFZWcH"
        v-if="showAppStore"
      >
        <span class="local-text">本地下载</span>
      </a>
      <div style="font-size: 12px;margin-top: 10px;" v-if="showAppStore">IOS/苹果用户下载前先查看<a href="https://liteex.zendesk.com/hc/zh-cn/articles/900002083446">《下载指南》</a></div>

      <a
        class="btn local"
        download="LiteEx"
        href="https://liteex-app.oss-cn-heyuan.aliyuncs.com/liteex.apk"
        v-else
      >
        <span class="local-text">本地下载</span>
      </a>
    </div>
    <div class="wechatNotice" :class="{'hide': userAgent.match(/MicroMessenger/i) != 'micromessenger'}"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAppStore: false,
      userAgent: navigator.userAgent.toLowerCase()
    };
  },
  mounted() {
    let u = navigator.userAgent;
    let app = navigator.appVersion;
    let ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    let iPad = u.indexOf('iPad') > -1;
    let iPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    if (ios || iPad || iPhone) {
      this.showAppStore = true
    } else {
      this.showAppStore = false
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin: 0 auto;
  padding-bottom: 80px;
  text-align: center;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 98px;
  padding: 20px 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}
.btn {
  flex: 1;
  height: 48px;
  border-radius: 5px;
  color: #fff;
  margin: 0 10px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-store {
  background-color: #222;
}
.apple-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
.store-warp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.store-text {
  line-height: 18px;
  font-weight: 500;
  font-size: 16px;
}
.apple-id {
  line-height: 14px;
  font-size: 10px;
}
.local {
  background-color: #5a59de;
}
.local-text {
  line-height: 48px;
  font-weight: 500;
  font-size: 16px;
}
.wechatNotice{
  position: fixed;
  right: 0;
  top: 0;
  width: 150px;
  height: 64px;
  z-index: 2500;
  background: image-set(
    url('../../assets/download/wechatNotice.png') 1x,
    url('../../assets/download/wechatNotice@2x.png') 2x
  );
  background-repeat: no-repeat;
  background-size: contain;
}
.hide {
  display: none;
}
</style>
