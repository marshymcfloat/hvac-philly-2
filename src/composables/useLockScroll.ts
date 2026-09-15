import { onBeforeUnmount, watch, type Ref } from 'vue'
import type Lenis from 'lenis'

let lenis: Lenis | null = null
let activeLocks = 0
let previousOverflow = ''

export function setLenisInstance(instance: Lenis | null) {
  lenis = instance
}

export function useLockScroll(isOpen: Ref<boolean>) {
  let ownsLock = false

  const lock = () => {
    if (ownsLock) return
    ownsLock = true

    if (activeLocks === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    }

    activeLocks += 1
  }

  const unlock = () => {
    if (!ownsLock) return
    ownsLock = false
    activeLocks = Math.max(0, activeLocks - 1)

    if (activeLocks === 0) {
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }

  watch(isOpen, (open) => (open ? lock() : unlock()), { immediate: true })
  onBeforeUnmount(unlock)
}
