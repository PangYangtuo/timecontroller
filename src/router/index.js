import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import tabletest from "../components/tabletest.vue";
import test from "../components/test.vue";
import login from "../components/login.vue";
import headerAndAside from "../components/headerAndAside.vue";
import projectManage from "../components/projectManage.vue";
import peopleManage from "../components/peopleManage.vue";
import projectReview from "../components/projectReview.vue";
import headerAndAsideByUser from "../components/headerAndAsideByUser.vue";
import headerAndAsideReview from "../components/headerAndAsideReview.vue";
import headerAndAsideSuperAdmin from "../components/headerAndAsideSuperAdmin.vue";
import newIndex from "../components/newIndex.vue";
// import login from "../components/login";

Vue.use(Router)

export default new Router({
  model: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: login
    },
    {
      path: '/tabletest',
      name: 'tabletest',
      component: tabletest
    },
    {
      path: '/test',
      name: 'test',
      component:test
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: headerAndAside
    },
    {
      path: '/projectManage',
      name: 'projectManage',
      component: projectManage
    },
    {
      path: '/peopleManage',
      name: 'peopleManage',
      component: peopleManage
    },
    {
      path: '/projectReview',
      name: 'projectReview',
      component: projectReview
    },
    {
      path: '/indexUser',
      name: 'indexUser',
      component: headerAndAsideByUser
    },
    {
      path: '/indexAdmin',
      name: 'indexAdmin',
      component: headerAndAsideReview
    },
    {
      path: '/indexSuperAdmin',
      name: 'indexSuperAdmin',
      component:headerAndAsideSuperAdmin
    },
        {
      path: '/newIndex',
      name: 'newIndex',
      component:newIndex
    },

  ]
})
