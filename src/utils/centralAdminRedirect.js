export const CENTRAL_ADMIN_ORIGIN = String(
  import.meta.env.VITE_CENTRAL_ADMIN_URL ?? 'https://admin.anhelm.com'
).trim().replace(/\/$/, '')

export function shouldRedirectToCentralAdmin(pathname) {
  const path = String(pathname || '')
  return path === '/login' || path === '/admin' || path.startsWith('/admin/')
}

export function centralAdminUrl(fromPath = '/') {
  let path = String(fromPath || '/').split('?')[0].split('#')[0]

  if (path === '/login' || path === '/admin/login') return `${CENTRAL_ADMIN_ORIGIN}/login`
  if (path === '/admin' || path === '/admin/') return `${CENTRAL_ADMIN_ORIGIN}/`
  if (path.startsWith('/admin/')) {
    path = path.slice('/admin'.length) || '/'
    if (path === '/dashboard') path = '/'
    return `${CENTRAL_ADMIN_ORIGIN}${path}`
  }

  return CENTRAL_ADMIN_ORIGIN
}

export function redirectToCentralAdmin(fromPath) {
  if (typeof window !== 'undefined') window.location.replace(centralAdminUrl(fromPath))
}
