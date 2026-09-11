import { createRouter, createWebHistory } from 'vue-router'

import MarketingShell from '../layouts/MarketingShell.vue'
import HomePage from '../pages/HomePage.vue'
import { redirectToCentralAdmin } from '../utils/centralAdminRedirect.js'

function redirectToCentralAdminRoute(to) {
  redirectToCentralAdmin(to.path)
  return false
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MarketingShell,
      children: [{ path: '', name: 'home', component: HomePage }]
    },
    { path: '/login', beforeEnter: redirectToCentralAdminRoute },
    { path: '/admin/:pathMatch(.*)*', beforeEnter: redirectToCentralAdminRoute }
  ],
  scrollBehavior: (to, from, savedPosition) => savedPosition || (to.fullPath === from.fullPath ? undefined : { top: 0 })
})

export default router
