<template>
  <div class="main">
    <img src="../../assets/download/bg.png" alt />
    <div class="footer">
      <a class="btn app-store" href="javascript:;" v-show="showAppStore">
        <i class="apple-icon">
          <img src="../../assets/download/apple.png" alt />
        </i>
        <article class="store-warp">
          <div class="store-text">App Store</div>
          <div class="apple-id">非大陆Apple ID</div>
        </article>
      </a>
      <a
        class="btn local"
        download="LiteEx"
        href="https://liteex-app.oss-cn-heyuan.aliyuncs.com/liteex.apk"
      >
        <span class="local-text">本地下载</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAppStore: false
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
      this.showAppStore = true
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
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 88px;
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
</style>
