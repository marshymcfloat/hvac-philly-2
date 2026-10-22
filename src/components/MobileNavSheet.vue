<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { useLockScroll } from '../composables/useLockScroll'

const props = defineProps({ open: { type: Boolean, required: true } })
const emit = defineEmits(['close'])
const closeButton = ref(null)
const sheet = ref(null)

useLockScroll(toRef(props, 'open'))

const close = () => emit('close')

const handleKeydown = (event) => {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (event.key !== 'Tab') return

  const focusable = sheet.value?.querySelectorAll('a[href], button:not([disabled])')
  if (!focusable?.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

let desktopQuery
const closeAtDesktop = (event) => {
  if (event.matches && props.open) close()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  desktopQuery = window.matchMedia('(min-width: 901px)')
  desktopQuery.addEventListener('change', closeAtDesktop)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  desktopQuery?.removeEventListener('change', closeAtDesktop)
})

watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  closeButton.value?.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="mobile-nav">
      <div v-if="open" id="mobile-navigation" ref="sheet" class="mobile-nav-sheet" role="dialog" aria-modal="true" aria-label="Mobile navigation" data-lenis-prevent>
        <header class="mobile-nav-header">
          <a class="wordmark brand-logo" href="#main" aria-label="Philly HVAC Pros home" @click="close"><img src="/superior-comfort-horizontal-transparent.png" alt="Superior Comfort Heating &amp; Cooling" width="1881" height="836" /></a>
          <button ref="closeButton" class="mobile-nav-close" type="button" aria-label="Close navigation" @click="close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
          </button>
        </header>

        <nav class="mobile-nav-links" aria-label="Mobile navigation" data-lenis-prevent>
          <a href="#about" @click="close"><span>01</span>About<i aria-hidden="true">&nearr;</i></a>
          <a href="#services" @click="close"><span>02</span>Services<i aria-hidden="true">&nearr;</i></a>
          <a href="#journal" @click="close"><span>03</span>Insights<i aria-hidden="true">&nearr;</i></a>
          <a class="mobile-nav-cta" href="tel:2154166557" @click="close"><span>04</span>Call us<i aria-hidden="true">&nearr;</i></a>
        </nav>

        <footer class="mobile-nav-footer"><a href="tel:2154166557">215-416-6557 &middot; 24/7 emergency service</a><p>545 N 58th Street, Philadelphia, PA 19131</p></footer>
      </div>
    </Transition>
  </Teleport>
</template>
