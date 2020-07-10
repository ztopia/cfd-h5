import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import(/* webpackChunkName: "register" */ "../views/login/Register.vue")
  },
  {
    path: "/klinechart",
    name: "kline",
    component: () => import(/* webpackChunkName: "register" */ "../views/kline/Index.vue")
  },
  {
    path: "/download",
    name: "download",
    component: () => import(/* webpackChunkName: "download" */ "../views/download/Download.vue")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router
