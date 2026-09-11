const RELOAD_FLAG = 'deploy-recovery-reloaded'
const STALE_ASSET_PATTERN = /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

function isStaleAssetError(message) {
  return STALE_ASSET_PATTERN.test(message || '')
}

function recoverFromStaleAssets(targetUrl) {
  if (!sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.setItem(RELOAD_FLAG, '1')
    window.location.reload()
    return
  }
  if (targetUrl) window.location.href = targetUrl
}

export function installDeployRecovery(router) {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    recoverFromStaleAssets()
  })

  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason || '')
    if (isStaleAssetError(message)) {
      event.preventDefault()
      recoverFromStaleAssets()
    }
  })

  router?.onError((error, to) => {
    if (isStaleAssetError(error?.message)) recoverFromStaleAssets(to.fullPath)
  })
}
