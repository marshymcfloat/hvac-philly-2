import { createApp } from 'vue'
import RouterApp from './RouterApp.vue'
import './style.css'
import router from './router/index.js'
import { redirectToCentralAdmin, shouldRedirectToCentralAdmin } from './utils/centralAdminRedirect.js'
import { installDeployRecovery } from './utils/deployRecovery.js'

if (shouldRedirectToCentralAdmin(window.location.pathname)) {
  redirectToCentralAdmin(window.location.pathname)
} else {
  installDeployRecovery(router)
  createApp(RouterApp).use(router).mount('#app')
}
